// Generador de reportes HTML de la UNA.
//   node generate.js            -> genera huevo y pollo
//   node generate.js huevo      -> solo huevo
//   node generate.js pollo      -> solo pollo
//
// Los datos y los indicadores derivados los resuelve el backend en un solo
// endpoint; aqui solo se maqueta el HTML. Requiere el backend encendido.

import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { healthCheck, obtenerModelo } from './src/api.js';
import { documento } from './src/html.js';
import { renderizar } from './src/render.js';
import { BACKEND_URL } from './config.js';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const SALIDA = join(RAIZ, 'out');

export async function generar(cuales = ['huevo', 'pollo'], { refrescar = true } = {}) {
  if (!(await healthCheck())) {
    throw new Error(
      `No se pudo contactar al backend en ${BACKEND_URL}.\n` +
      `Enciendelo primero (pnpm dev en powerbiBackend) y vuelve a intentar.`
    );
  }

  const producto = cuales.length === 1 ? cuales[0] : 'todos';
  console.log(`Consultando ${BACKEND_URL}/api/reportes/avicola...`);
  const inicio = Date.now();
  const data = await obtenerModelo({ producto, refrescar });
  console.log(`Modelo recibido en ${((Date.now() - inicio) / 1000).toFixed(1)}s${data.desdeCache ? ' (desde cache)' : ''}.\n`);

  await mkdir(SALIDA, { recursive: true });

  const generados = [];
  for (const nombre of cuales) {
    const modelo = data.reportes?.[nombre];
    if (!modelo) throw new Error(`El backend no devolvió el reporte "${nombre}"`);
    console.log(`Construyendo reporte de ${nombre}...`);
    const html = documento(renderizar(modelo));
    const archivo = join(SALIDA, `reporte_${nombre}.html`);
    await writeFile(archivo, html, 'utf8');
    generados.push({ nombre, archivo, bytes: Buffer.byteLength(html) });
    console.log(`  -> ${archivo} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
  }
  return generados;
}

if (process.argv[1]?.endsWith('generate.js')) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const cuales = args.length && args[0] !== 'all' ? args : ['huevo', 'pollo'];
  generar(cuales)
    .then((r) => {
      console.log(`\nListo. ${r.length} reporte(s) generado(s) en ${SALIDA}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`\nError: ${err.message}`);
      process.exit(1);
    });
}
