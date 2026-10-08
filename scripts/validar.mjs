// Validador de los reportes generados: ejecuta el JS embebido con un stub de
// Chart.js y del DOM para detectar errores que solo apareceran en el navegador
// (claves de datos inexistentes, canvas faltantes, series vacias, filtros rotos).

import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const tieneDato = (v) => Array.isArray(v) && v.some((x) => x !== null && x !== undefined && !Number.isNaN(x));

async function validar(nombre) {
  const ruta = join(RAIZ, 'out', `reporte_${nombre}.html`);
  const html = await readFile(ruta, 'utf8');
  const problemas = [];

  const canvasIds = new Set([...html.matchAll(/<canvas id="([^"]+)"/g)].map((m) => m[1]));
  const bloques = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!bloques.length) return [`${nombre}: no se encontro el script embebido`];
  const codigo = bloques[bloques.length - 1];

  // --- stubs -------------------------------------------------------------
  const instancias = [];
  function Chart(canvas, cfg) {
    const inst = { canvasId: canvas?.id, data: cfg?.data ?? {}, update() {} };
    instancias.push(inst);
    return inst;
  }
  Chart.defaults = { font: {}, plugins: { legend: { labels: {} }, tooltip: {} } };

  const botones = [];
  const crearElemento = (tag) => {
    const el = {
      tag, textContent: '', dataset: {}, hijos: [],
      classList: { toggle() {}, add() {}, remove() {}, contains: () => false },
      addEventListener(evt, fn) { if (evt === 'click') el.onClick = fn; },
      appendChild(h) { el.hijos.push(h); if (h.onClick) botones.push(h); return h; },
      querySelectorAll: () => el.hijos,
    };
    return el;
  };
  const contenedores = new Map();
  const sandbox = {
    Chart,
    document: {
      createElement: crearElemento,
      getElementById: (id) => {
        if (canvasIds.has(id)) return { id };
        if (!contenedores.has(id)) contenedores.set(id, crearElemento('div'));
        return contenedores.get(id);
      },
    },
    console,
  };

  try {
    vm.createContext(sandbox);
    vm.runInContext(codigo, sandbox, { timeout: 20000 });
  } catch (err) {
    return [`${nombre}: el script fallo -> ${err.message}`];
  }

  // --- revisiones --------------------------------------------------------
  const usados = instancias.map((i) => i.canvasId);
  for (const id of canvasIds) {
    if (!usados.includes(id)) problemas.push(`${nombre}: el canvas "${id}" no recibe ningun grafico`);
  }

  // Una serie sin valores puede ser un error (clave mal escrita) o un hecho
  // real (ese origen no comercia ese producto). Lo estructural se reporta como
  // problema; lo que simplemente no existe en los datos se reporta como aviso.
  const avisos = [];
  const revisarSeries = (contexto) => {
    for (const inst of instancias) {
      for (const ds of inst.data?.datasets ?? []) {
        if (!Array.isArray(ds.data)) {
          problemas.push(`${nombre}: la serie "${ds.label}" (${inst.canvasId}) no es un arreglo${contexto}`);
        } else if (!tieneDato(ds.data)) {
          avisos.push(`${nombre}: "${ds.label}" sin datos en ${inst.canvasId}${contexto}`);
        }
      }
    }
  };
  revisarSeries('');

  // Se simula el clic en cada opcion para comprobar que el filtro no rompe.
  for (const b of botones) {
    try {
      b.onClick();
    } catch (err) {
      problemas.push(`${nombre}: el filtro "${b.textContent}" fallo -> ${err.message}`);
      continue;
    }
    revisarSeries(` con "${b.textContent}"`);
  }

  // Un grafico cuyas series esten TODAS vacias si es un problema real.
  for (const inst of instancias) {
    const ds = inst.data?.datasets ?? [];
    if (ds.length && ds.every((x) => !tieneDato(x.data))) {
      problemas.push(`${nombre}: el grafico "${inst.canvasId}" quedo sin ninguna serie con datos`);
    }
  }
  validar.avisos = (validar.avisos ?? []).concat([...new Set(avisos)]);

  // Categorias repetidas en el eje: suele indicar una dimension sin agregar.
  for (const inst of instancias) {
    const textuales = (inst.data?.labels ?? []).filter((l) => typeof l === 'string');
    const unicos = new Set(textuales);
    if (textuales.length > 1 && unicos.size < textuales.length && textuales.length <= 30) {
      const repetidas = [...new Set(textuales.filter((l, i) => textuales.indexOf(l) !== i))];
      problemas.push(`${nombre}: el grafico "${inst.canvasId}" repite categorias en el eje (${repetidas.join(', ')})`);
    }
  }

  // Marcadores de datos faltantes en el contenido visible.
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const marcador of ['undefined', 'NaN', '[object Object]']) {
    if (visible.includes(marcador)) problemas.push(`${nombre}: el contenido visible contiene "${marcador}"`);
  }

  console.log(`${nombre}: ${instancias.length} graficos, ${canvasIds.size} canvas, ${botones.length} opciones de filtro`);
  return problemas;
}

const todos = [];
for (const r of ['huevo', 'pollo']) todos.push(...(await validar(r)));

const avisos = [...new Set(validar.avisos ?? [])];
if (avisos.length) {
  console.log('\nAvisos (combinaciones sin datos en la fuente, no son fallas):');
  for (const a of avisos.slice(0, 12)) console.log(`  · ${a}`);
  if (avisos.length > 12) console.log(`  · ... y ${avisos.length - 12} mas`);
}

if (todos.length) {
  console.log('\nProblemas detectados:');
  for (const p of todos) console.log(`  - ${p}`);
  process.exit(1);
}
console.log('\nValidacion correcta: todos los graficos y filtros funcionan.');
