// Capa de presentacion: replica el layout/tipografia de los reportes HTML
// originales de la UNA, pero con la paleta de marca del frontend.

import { UNA } from '../config.js';

export const CSS = `
:root{
  --azul:${UNA.navyPrimary}; --marino:${UNA.navyDeep}; --hueso:${UNA.bgLight}; --tinta:${UNA.textDark};
  --gris:${UNA.textMuted}; --linea:${UNA.line}; --naranja:${UNA.amber}; --dorado:${UNA.accentYellow};
  --rojo:${UNA.red}; --verde:${UNA.green}; --cyan:${UNA.cyan};
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Poppins','Montserrat','Avenir Next','Segoe UI',system-ui,sans-serif;background:var(--hueso);color:var(--tinta);font-size:15px;line-height:1.55}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}

header{background:var(--marino);color:#fff;position:relative;overflow:hidden}
header .wrap{display:flex;align-items:center;gap:28px;padding:32px 20px 28px;position:relative;z-index:1}
.logo{flex:0 0 auto}
.h-title h1{font-size:clamp(24px,3.4vw,38px);font-weight:800;text-transform:uppercase;letter-spacing:.5px;line-height:1.12}
.h-title .sub{margin-top:8px;color:#A9C5E8;font-weight:500;font-size:14px;letter-spacing:.3px}
.h-title .raya{width:56px;height:5px;background:var(--dorado);margin-top:14px;border-radius:2px}
.dots{position:absolute;right:24px;bottom:18px;opacity:.5}

nav{background:var(--azul);position:sticky;top:0;z-index:50;box-shadow:0 2px 10px rgba(6,37,75,.25)}
nav .wrap{display:flex;gap:4px;overflow-x:auto;padding:0 20px}
nav a{color:#fff;text-decoration:none;font-weight:700;font-size:12.5px;text-transform:uppercase;letter-spacing:.8px;padding:13px 16px;white-space:nowrap;border-bottom:3px solid transparent}
nav a:hover,nav a:focus-visible{border-bottom-color:var(--dorado);outline:none}

.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin:26px 0}
.kpi{background:#fff;border:1px solid var(--linea);border-top:5px solid var(--azul);border-radius:10px;padding:16px 18px}
.kpi .lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--gris)}
.kpi .val{font-size:30px;font-weight:800;color:var(--marino);margin:4px 0 2px;font-variant-numeric:tabular-nums}
.kpi .val small{font-size:15px;font-weight:600;color:var(--gris)}
.kpi .delta{font-size:12.5px;font-weight:700}
.kpi .delta.up{color:var(--verde)}.kpi .delta.dn{color:var(--rojo)}
.kpi .note{font-size:11.5px;color:var(--gris);margin-top:3px}

.banda{background:var(--azul);color:#fff;margin-top:40px;border-radius:10px;display:flex;align-items:center;gap:18px;padding:14px 22px;position:relative;overflow:hidden}
.banda h2{font-size:clamp(17px,2.2vw,23px);font-weight:800;text-transform:uppercase;letter-spacing:.6px}
.banda .num{font-size:12px;font-weight:700;background:rgba(255,255,255,.18);padding:4px 10px;border-radius:20px;letter-spacing:1px;flex:0 0 auto}

.grid{display:grid;gap:16px;margin-top:16px}
.g2{grid-template-columns:1fr 1fr}
@media(max-width:880px){.g2{grid-template-columns:1fr}}
.card{background:#fff;border:1px solid var(--linea);border-radius:12px;padding:18px 18px 14px;box-shadow:0 1px 3px rgba(6,37,75,.05)}
.card h3{font-size:14.5px;font-weight:800;color:var(--marino);text-transform:uppercase;letter-spacing:.4px}
.card .desc{font-size:12.5px;color:var(--gris);margin:4px 0 10px}
.chart{position:relative;height:320px}
.chart.tall{height:380px}
.chart.short{height:280px}
canvas{max-width:100%}
.fuente{font-size:10.5px;color:#93A3BC;margin-top:8px;text-transform:uppercase;letter-spacing:.5px}

details.como{margin-top:10px;border:1px solid var(--linea);border-radius:9px;background:#F7FBFF;font-size:13px}
details.como summary{cursor:pointer;padding:9px 14px;font-weight:700;color:var(--azul);font-size:12.5px;list-style:none;display:flex;align-items:center;gap:8px}
details.como summary::-webkit-details-marker{display:none}
details.como summary::before{content:'?';display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--azul);color:#fff;font-size:11px;font-weight:800;flex:0 0 auto}
details.como[open] summary{border-bottom:1px solid var(--linea)}
details.como .cuerpo{padding:12px 16px 14px;color:var(--tinta)}
details.como .cuerpo p{margin-bottom:8px}
details.como .cuerpo p:last-child{margin-bottom:0}
details.como strong{color:var(--marino)}

.ctrl{display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 10px;align-items:center}
.ctrl .lblc{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--gris);margin-right:2px}
.ctrl button{font:inherit;font-size:11.5px;font-weight:700;padding:4px 11px;border-radius:16px;border:1.5px solid var(--azul);background:#fff;color:var(--azul);cursor:pointer;font-variant-numeric:tabular-nums}
.ctrl button.on{background:var(--azul);color:#fff}
.ctrl button.all{border-color:var(--gris);color:var(--gris)}
.ctrl button.all.on{background:var(--gris);color:#fff;border-color:var(--gris)}
.ctrl button:focus-visible{outline:2px solid var(--dorado);outline-offset:2px}
.hintc{font-size:11px;color:#93A3BC;margin:-4px 0 8px}

.heat-wrap{overflow-x:auto}
/* table-layout fijo: reparte las 12 columnas por igual para que todos los
   mapas de calor queden con la misma proporcion, sin importar si una celda
   dice "n/d" o "+27.7%". */
.heat-table{width:100%;min-width:500px;table-layout:fixed;border-collapse:separate;border-spacing:2px;font-size:10.5px;font-variant-numeric:tabular-nums}
.heat-table th{font-size:9.5px;font-weight:700;color:var(--gris);text-transform:uppercase;letter-spacing:.3px;padding:2px 0;text-align:center}
.heat-table th.yr-col,.heat-table td.yr{width:44px}
.heat-table td.yr{font-size:11.5px;font-weight:800;color:var(--marino);text-align:right;padding-right:8px;white-space:nowrap}
.heat-cell{border-radius:5px;text-align:center;padding:9px 1px;font-weight:700;white-space:nowrap}
.heat-cell.empty{background:#EEF4FC!important;color:#BFCDE0;font-weight:500;font-size:10px}

.tabla-wrap{overflow-x:auto}
table.datos{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums}
table.datos th{background:var(--marino);color:#fff;font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;padding:9px 10px;text-align:left;position:sticky;top:0}
table.datos td{padding:8px 10px;border-bottom:1px solid var(--linea)}
table.datos tbody tr:nth-child(even){background:#F7FBFF}
table.datos td.n{text-align:right}

.lectura{background:#fff;border:1px solid var(--linea);border-left:6px solid var(--dorado);border-radius:10px;padding:16px 20px;margin-top:16px;font-size:14px}
.lectura strong{color:var(--marino)}
.lectura ul{margin:8px 0 0 18px}
.lectura li{margin-bottom:6px}
.metodo{background:var(--marino);color:#D7E4F4;border-radius:12px;padding:20px 24px;margin-top:16px;font-size:13.5px}
.metodo h3{color:#fff;font-size:14px;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px}
.metodo p{margin-bottom:8px}
.badge-r{display:inline-block;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);padding:2px 10px;border-radius:14px;font-weight:700}
.cofece{background:#fff;border:1px solid var(--linea);border-radius:12px;margin:34px 0 10px;padding:18px 22px;font-size:12px;color:var(--gris)}
.cofece h4{color:var(--marino);font-size:12.5px;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px}
footer{background:var(--marino);color:#A9C5E8;margin-top:26px;padding:20px 0;font-size:12px}
footer .wrap{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:center}
.aviso{background:#FFF8E1;border:1px solid var(--dorado);border-radius:10px;padding:12px 18px;margin-top:16px;font-size:13px;color:var(--tinta)}
@media print{nav{position:static}.chart{height:300px!important}}
`;

// Logotipo UNA simplificado en SVG (evita depender de un archivo externo).
const LOGO = `<svg width="78" height="92" viewBox="0 0 78 92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="UNA">
<ellipse cx="39" cy="34" rx="22" ry="27" stroke="#fff" stroke-width="2.6" fill="none"/>
<path d="M39 14c-6 5-9 12-9 20 0 7 4 13 9 17 5-4 9-10 9-17 0-8-3-15-9-20z" stroke="#fff" stroke-width="2.2" fill="none"/>
<circle cx="39" cy="24" r="2.6" fill="${UNA.accentYellow}"/>
<text x="39" y="82" text-anchor="middle" font-family="Poppins,Segoe UI,sans-serif" font-size="25" font-weight="800" fill="#fff">UNA</text>
</svg>`;

const DOTS = `<svg class="dots" width="190" height="78" viewBox="0 0 190 78" xmlns="http://www.w3.org/2000/svg">
${Array.from({ length: 6 }, (_, f) =>
  Array.from({ length: 14 }, (_, c) => `<circle cx="${6 + c * 14}" cy="${6 + f * 14}" r="2.3" fill="#fff" opacity="0.45"/>`).join('')
).join('')}</svg>`;

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function kpi({ label, valor, unidad = '', delta: d, nota = '' }) {
  return `<div class="kpi">
      <div class="lbl">${esc(label)}</div>
      <div class="val">${esc(valor)}${unidad ? ` <small>${esc(unidad)}</small>` : ''}</div>
      ${d ? `<div class="delta ${d.clase}">${esc(d.texto)}</div>` : ''}
      ${nota ? `<div class="note">${esc(nota)}</div>` : ''}
    </div>`;
}

export function banda(titulo, numero) {
  return `<div class="banda"><h2>${esc(titulo)}</h2><span class="num">${esc(numero)}</span></div>`;
}

export function card({ titulo, desc = '', cuerpo, fuente = '', alto = '' }) {
  return `<div class="card">
      <h3>${esc(titulo)}</h3>
      ${desc ? `<div class="desc">${esc(desc)}</div>` : ''}
      ${cuerpo}
      ${fuente ? `<div class="fuente">${esc(fuente)}</div>` : ''}
    </div>`;
}

export function cardChart({ id, titulo, desc = '', fuente = '', alto = '' }) {
  return card({
    titulo,
    desc,
    fuente,
    cuerpo: `<div class="chart ${alto}"><canvas id="${esc(id)}"></canvas></div>`,
  });
}

// Tarjeta con selector de opciones encima del grafico. Los botones los crea
// el script del grafico a partir de las opciones embebidas en los datos.
export function cardChartFiltro({ id, ctrlId, titulo, desc = '', fuente = '', alto = '', etiquetaCtrl = 'Producto' }) {
  return card({
    titulo,
    desc,
    fuente,
    cuerpo: `<div class="ctrl" id="${esc(ctrlId)}"><span class="lblc">${esc(etiquetaCtrl)}</span></div>
      <div class="chart ${alto}"><canvas id="${esc(id)}"></canvas></div>`,
  });
}

export function tabla({ columnas, filas }) {
  const head = columnas.map((c) => `<th>${esc(c.label)}</th>`).join('');
  const body = filas
    .map(
      (f) =>
        `<tr>${columnas.map((c) => `<td class="${c.num ? 'n' : ''}">${esc(c.get(f))}</td>`).join('')}</tr>`
    )
    .join('');
  return `<div class="tabla-wrap"><table class="datos"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function lectura(html) {
  return `<div class="lectura">${html}</div>`;
}

export function documento({ titulo, h1, subtitulo, nav: navItems, secciones, datos, scripts, metodologia }) {
  const navHtml = navItems.map((n) => `<a href="#${esc(n.id)}">${esc(n.label)}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<header>
  <div class="wrap">
    <div class="logo">${LOGO}</div>
    <div class="h-title">
      <h1>${h1}</h1>
      <div class="sub">${esc(subtitulo)}</div>
      <div class="raya"></div>
    </div>
    ${DOTS}
  </div>
</header>
<nav><div class="wrap">${navHtml}</div></nav>
<div class="wrap">
${secciones}
${metodologia || ''}
<div class="cofece">
  <h4>Declaracion antimonopolio</h4>
  <p>Este documento tiene fines exclusivamente informativos y estadisticos. La informacion es historica y agregada; no constituye una recomendacion de precios ni un acuerdo entre competidores. Cada participante determina su conducta comercial de forma independiente.</p>
</div>
</div>
<footer><div class="wrap">
  <span>Union Nacional de Avicultores &middot; Reporte generado automaticamente</span>
  <span>Datos en vivo desde la base de datos institucional</span>
</div></footer>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
const DATOS = ${JSON.stringify(datos)};
Chart.defaults.font.family = "'Poppins','Montserrat','Segoe UI',system-ui,sans-serif";
Chart.defaults.font.size = 11.5;
Chart.defaults.color = '${UNA.textMuted}';
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.boxHeight = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.tooltip.backgroundColor = '${UNA.navyDeep}';
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.maintainAspectRatio = false;
const fmt = (v, d = 0) => v === null || v === undefined ? '—' : Number(v).toLocaleString('es-MX', {minimumFractionDigits: d, maximumFractionDigits: d});
const fmtC = (v) => { if (v === null || v === undefined) return '—'; const a = Math.abs(v);
  if (a >= 1e9) return (v/1e9).toFixed(2)+' MM'; if (a >= 1e6) return (v/1e6).toFixed(1)+' M';
  if (a >= 1e3) return (v/1e3).toFixed(0)+' mil'; return fmt(v); };
const ejeMoneda = { ticks: { callback: (v) => '$' + fmt(v, 0) } };
const ejeCompacto = { ticks: { callback: (v) => fmtC(v) } };
${scripts}
</script>
</body>
</html>`;
}
