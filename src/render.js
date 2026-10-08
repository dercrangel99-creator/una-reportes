// Renderizado: convierte el modelo que entrega el backend en el HTML del
// reporte. Aqui no se calcula nada — los indicadores derivados vienen ya
// resueltos del endpoint. Lo unico que vive aqui es la presentacion: paleta,
// tipos de grafico y maquetacion.

import * as C from './charts.js';
import * as H from './html.js';
import * as M from './metrics.js';
import { UNA } from '../config.js';

// El backend nombra los colores de forma semantica para no imponer una paleta.
const PALETA = {
  navy: UNA.navyPrimary,
  gold: UNA.accentYellow,
  cyan: UNA.cyan,
  green: UNA.green,
  red: UNA.red,
  amber: UNA.amber,
  gris: '#9AA5B1',
};
const color = (nombre) => (nombre ? PALETA[nombre] ?? nombre : undefined);

// El modelo marca el enfasis con **dobles asteriscos**: se convierte a HTML
// despues de escapar, para que el texto no pueda inyectar marcado.
function enfasis(texto) {
  return H.esc(texto).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function valorKpi(k) {
  if (k.valor === null || k.valor === undefined) return '—';
  if (k.formato === 'moneda') return M.fmtMoneda(k.valor);
  if (k.formato === 'compacto') return M.fmtCompacto(k.valor);
  return M.fmtNum(k.valor);
}

function tarjetaKpi(k) {
  const d = k.delta
    ? { texto: `${k.delta.pct > 0 ? '▲' : k.delta.pct < 0 ? '▼' : '—'} ${Math.abs(k.delta.pct).toFixed(1)}%${k.deltaNota ? ` ${k.deltaNota}` : ''}`,
        clase: k.delta.direccion === 'sube' ? 'up' : k.delta.direccion === 'baja' ? 'dn' : '' }
    : null;
  return H.kpi({ label: k.label, valor: valorKpi(k), unidad: k.unidad ?? '', delta: d, nota: k.nota ?? '' });
}

// --- graficos -------------------------------------------------------------

// Cada tipo del modelo se traduce al constructor correspondiente y deja sus
// datos en DATOS[id]. Devuelve { script, datos }.
function construirGrafico(g) {
  const base = { id: g.id, datosKey: g.id, eje: g.eje ?? '', moneda: !!g.moneda };

  if (g.tipo === 'linea') {
    return {
      datos: { labels: g.labels, ...Object.fromEntries(g.series.map((s) => [s.key, s.datos])) },
      script: C.linea({
        ...base, compacto: g.compacto ?? false,
        series: g.series.map((s) => ({ key: s.key, label: s.label, color: color(s.color), dash: s.dash, relleno: s.relleno })),
      }),
    };
  }

  if (g.tipo === 'barras') {
    return {
      datos: { labels: g.labels, ...Object.fromEntries(g.series.map((s) => [s.key, s.datos])) },
      script: C.barras({
        ...base, compacto: g.compacto ?? true, apilado: !!g.apilado,
        horizontal: !!g.horizontal, etiquetas: !!g.etiquetas, decimales: g.decimales ?? null,
        series: g.series.map((s) => ({ key: s.key, label: s.label, color: color(s.color) })),
      }),
    };
  }

  if (g.tipo === 'combo') {
    return {
      datos: {
        labels: g.labels,
        ...Object.fromEntries([...g.barras, ...g.lineas].map((s) => [s.key, s.datos])),
      },
      script: C.combo({
        id: g.id, datosKey: g.id, ejeIzq: g.ejeIzq ?? '', ejeDer: g.ejeDer ?? '',
        barras: g.barras.map((s) => ({ key: s.key, label: s.label, color: color(s.color) })),
        lineas: g.lineas.map((s) => ({ key: s.key, label: s.label, color: color(s.color), dash: s.dash, ejeIzq: s.ejeIzq })),
      }),
    };
  }

  if (g.tipo === 'lineaFiltrada') {
    return {
      datos: { labels: g.labels, opciones: g.opciones, series: g.series },
      script: C.lineaFiltrada({
        ...base, ctrlId: g.ctrlId, decimales: g.moneda ? 2 : null,
        series: g.definicionSeries.map((s) => ({ key: s.key, label: s.label, color: color(s.color) })),
      }),
    };
  }

  if (g.tipo === 'barrasFiltradas') {
    return {
      datos: { opciones: g.opciones, series: g.series },
      script: C.barrasFiltradas({
        id: g.id, ctrlId: g.ctrlId, datosKey: g.id,
        label: g.label, eje: g.eje ?? '', color: color(g.color),
      }),
    };
  }

  throw new Error(`Tipo de gráfico desconocido en el modelo: ${g.tipo}`);
}

function tarjetaGrafico(g) {
  const comun = { id: g.id, titulo: g.titulo, desc: g.descripcion ?? '', fuente: g.fuente ?? '', alto: g.alto ?? '' };
  return g.ctrlId
    ? H.cardChartFiltro({ ...comun, ctrlId: g.ctrlId, etiquetaCtrl: g.etiquetaCtrl ?? 'Opción' })
    : H.cardChart(comun);
}

function tarjetaHeatmap(h) {
  return H.card({
    titulo: h.titulo, desc: h.descripcion ?? '', fuente: h.fuente ?? '',
    cuerpo: C.heatmapHtml(h.matriz),
  });
}

function tarjetaTabla(t) {
  return H.card({
    titulo: t.titulo, desc: t.descripcion ?? '', fuente: t.fuente ?? '',
    cuerpo: H.tabla({
      columnas: t.columnas.map((c) => ({
        label: c.label, num: !!c.numero,
        get: (f) => (c.numero ? M.fmtNum(f[c.clave]) : f[c.clave] ?? '—'),
      })),
      filas: t.filas,
    }),
  });
}

// Agrupa en una rejilla de dos columnas los elementos marcados como "mitad".
function maquetar(elementos) {
  const html = [];
  let pendiente = [];
  const vaciar = () => {
    if (!pendiente.length) return;
    html.push(pendiente.length === 1 ? pendiente[0] : `<div class="grid g2">${pendiente.join('')}</div>`);
    pendiente = [];
  };
  for (const e of elementos) {
    if (e.mitad) pendiente.push(e.html);
    else { vaciar(); html.push(e.html); }
    if (pendiente.length === 2) vaciar();
  }
  vaciar();
  return html.join('\n');
}

// --- documento ------------------------------------------------------------

export function renderizar(modelo) {
  const DATOS = {};
  const scripts = [];

  const kpisPrincipales = modelo.kpis.filter((k) => !k.secundario && k.seccion !== 'sanidad');
  const nav = [{ id: 'resumen', label: 'Resumen' }];
  const bloques = [];

  bloques.push(`<section id="resumen">
  <div class="kpis">${kpisPrincipales.map(tarjetaKpi).join('')}</div>
  ${modelo.lectura ? `<div class="lectura">${enfasis(modelo.lectura)}</div>` : ''}
</section>`);

  for (const sec of modelo.secciones) {
    nav.push({ id: sec.id, label: sec.navLabel ?? sec.titulo });

    const elementos = [];
    for (const g of sec.graficos ?? []) {
      const { datos, script } = construirGrafico(g);
      DATOS[g.id] = datos;
      scripts.push(script);
      elementos.push({ mitad: !!g.mitad, html: tarjetaGrafico(g) });
    }
    for (const h of sec.heatmaps ?? []) elementos.push({ mitad: !!h.mitad, html: tarjetaHeatmap(h) });
    for (const t of sec.tablas ?? []) elementos.push({ mitad: false, html: tarjetaTabla(t) });

    const kpisSeccion = modelo.kpis.filter((k) => k.seccion === sec.id);

    bloques.push(`<section id="${H.esc(sec.id)}">
  ${H.banda(sec.titulo, sec.numero)}
  ${kpisSeccion.length ? `<div class="kpis">${kpisSeccion.map(tarjetaKpi).join('')}</div>` : ''}
  ${maquetar(elementos)}
  ${(sec.lecturas ?? []).map((l) => `<div class="lectura">${enfasis(l)}</div>`).join('')}
  ${(sec.avisos ?? []).map((a) => `<div class="aviso"><strong>${H.esc(a.titulo)}.</strong> ${H.esc(a.texto)}</div>`).join('')}
</section>`);
  }

  nav.push({ id: 'nota', label: 'Nota metodológica' });

  const metodologia = `
<div class="metodo" id="nota">
  <h3>Nota metodológica y alcance</h3>
  <p><span class="badge-r">Origen de los datos</span>&nbsp; Todas las cifras provienen de la base de datos institucional y se consultan en el momento de generar el reporte. Los indicadores derivados —promedios y sumas móviles, variación interanual, correlaciones y conversiones de unidad— se calculan en el servidor, de modo que cualquier sistema que consuma el mismo servicio obtiene exactamente estas cifras.</p>
  <p><span class="badge-r">Ventanas móviles</span>&nbsp; Las ventanas de 12 meses se alinean al último dato disponible, no al año calendario, para que los cortes de calendario no se lean como tendencia.</p>
  <p><span class="badge-r">Comercio exterior</span>&nbsp; Las cifras salen de los pedimentos aduanales. Se omite el precio implícito de los meses con volumen marginal, donde los costos fijos del embarque distorsionan el valor por kilogramo.</p>
  <p><span class="badge-r">Revisiones</span>&nbsp; Las cifras más recientes pueden ser preliminares y ajustarse en cargas posteriores.</p>
  <p><span class="badge-r">Generado</span>&nbsp; ${new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</p>
</div>`;

  return {
    titulo: modelo.meta.titulo,
    h1: (modelo.meta.encabezadoLineas ?? [modelo.meta.encabezado ?? '']).map(H.esc).join('<br>'),
    subtitulo: `Unión Nacional de Avicultores · Datos a ${modelo.meta.datosA ?? 'la última carga disponible'}`,
    nav,
    secciones: bloques.join('\n'),
    datos: DATOS,
    scripts: scripts.join('\n'),
    metodologia,
  };
}
