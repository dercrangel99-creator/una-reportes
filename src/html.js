// Capa de presentacion: CSS, cabecera, tarjetas y secciones del reporte,
// con el Design System v3 de la UNA (DESIGN-una-v3.md): contenido de datos en
// el estilo claro de dashboards y estructura en el estilo oscuro "CME".

import { existsSync, readFileSync } from 'node:fs';

import { V3, FUENTES, HEAT_V3 } from '../config.js';

export const CSS = `
:root{
  --una-bg:${V3.pageBg}; --una-panel:${V3.panel}; --una-border:${V3.panelBorder}; --una-hairline:${V3.hairline};
  --una-hairline-ui:${V3.hairlineUi}; --una-text:${V3.text}; --una-text-2:${V3.text2}; --una-muted:${V3.textMuted};
  --una-strong:${V3.navyDeep}; --una-title:${V3.panelTitle}; --una-label:${V3.fieldLabel}; --una-caption:${V3.caption};
  --una-accent:${V3.navyPrimary}; --una-cyan:${V3.cyan}; --una-cyan-text:${V3.cyanText}; --una-gold:${V3.yellow};
  --una-gold-light:${V3.yellowLight}; --una-dark:${V3.brandDark}; --una-navy:${V3.brandNavy}; --una-slate:${V3.brandSlate};
  --una-on-dark:${V3.textOnDark}; --una-on-dark-strong:${V3.textOnDarkStrong}; --una-on-dark-2:${V3.textOnDark2};
  --una-on-dark-3:${V3.textOnDark3}; --una-hairline-dark:${V3.hairlineDark}; --una-hairline-dark-ui:${V3.hairlineDarkUi};
  --una-up:${V3.okText}; --una-down:${V3.errorText};
  --una-shadow-rest:${V3.shadowRest}; --una-shadow-hover:${V3.shadowHover};
  --una-radius:${V3.radius}; --una-radius-panel:${V3.radiusPanel}; --una-ease:${V3.ease};
  --una-font-display:${FUENTES.display}; --una-font-ui:${FUENTES.ui}; --una-font-num:${FUENTES.num};
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--una-font-ui);background:var(--una-bg);color:var(--una-text);font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
::selection{background:var(--una-gold);color:var(--una-dark)}

/* Estructura oscura CME: rejilla de 50px sobre navy */
.metodo{background-color:var(--una-navy);background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:50px 50px}
:root{--side-w:268px}
.skip{position:absolute;left:-9999px;top:8px;z-index:200;background:var(--una-gold);color:var(--una-dark);padding:10px 16px;border-radius:var(--una-radius);font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;text-decoration:none}
.skip:focus{left:8px}

/* Sidebar de paginas (patron sidebar admin) */
.side{position:fixed;inset:0 auto 0 0;width:var(--side-w);z-index:90;display:flex;flex-direction:column;background:var(--una-navy);border-right:1px solid var(--una-hairline-dark);color:var(--una-on-dark)}
.side-brand{display:flex;align-items:center;gap:14px;padding:26px 22px 22px;border-bottom:1px solid var(--una-hairline-dark);text-decoration:none}
.side-brand svg{flex:0 0 auto}
.side-brand .t1{display:block;font-size:9.5px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--una-gold)}
.side-brand .t2{display:block;margin-top:5px;font-family:var(--una-font-display);font-size:17px;font-weight:500;line-height:1.2;color:#fff}
.side-label{display:flex;align-items:center;gap:10px;padding:24px 22px 10px;font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.side-label::before{content:'';width:22px;height:1px;background:rgba(14,165,233,.4);flex:0 0 auto}
.side-nav{flex:1;overflow-y:auto;padding:0 12px 16px}
.side-nav a{display:flex;align-items:baseline;gap:12px;padding:10px 12px;margin:1px 0;border-left:2px solid transparent;border-radius:0 var(--una-radius) var(--una-radius) 0;color:rgba(255,255,255,.7);text-decoration:none;font-size:13px;font-weight:500;line-height:1.35;transition:background .2s ease,color .2s ease,border-color .2s ease}
.side-nav .pn{flex:0 0 22px;font-family:var(--una-font-display);font-style:italic;font-size:15px;color:var(--una-cyan)}
.side-nav a:hover{background:rgba(255,255,255,.04);color:#fff}
.side-nav a.on{background:rgba(14,165,233,.15);color:#fff;border-left-color:var(--una-gold)}
.side-nav a.on .pn{color:var(--una-gold)}
.side-nav a:focus-visible{outline:2px solid rgba(14,165,233,.5);outline-offset:-2px}
.side-foot{padding:16px 22px 22px;border-top:1px solid var(--una-hairline-dark);font-size:9.5px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--una-on-dark-3)}
.side-foot strong{display:block;margin-top:5px;font-family:var(--una-font-num);font-size:12px;font-weight:500;letter-spacing:0;text-transform:none;color:var(--una-on-dark)}
.side-backdrop{display:none}
.topbar{display:none}

/* Area de contenido: cada seccion es una pagina */
.main{margin-left:var(--side-w);min-width:0}
.page{min-height:100vh;padding:56px clamp(20px,4vw,56px) 72px;border-bottom:1px solid var(--una-hairline)}
.page-in{max-width:1180px;margin:0 auto}

/* Portada (modo claro): cover con el titulo arriba y el resumen debajo */
.cover-res{margin-top:44px}
.cover-res .lectura{font-size:14.5px;line-height:1.75;padding:20px 26px}
.cover-res .kpi{padding:18px 20px 16px}
.cover-res .kpi .val{margin:10px 0}
.eyebrow{display:inline-flex;align-items:center;gap:12px;font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--una-accent)}
.eyebrow::before{content:'';width:32px;height:1px;background:var(--una-gold-light);flex:0 0 auto}
.eyebrow.on-dark{color:var(--una-gold)}
.eyebrow.on-dark::before{background:var(--una-cyan)}
.cover-res h2{margin-top:16px;font-family:var(--una-font-display);font-size:clamp(28px,2.8vw,40px);font-weight:500;line-height:1.08;letter-spacing:-.01em;color:var(--una-strong)}
.cover-res h2 em,.cover-hero h1 em{font-style:italic;font-weight:400;color:var(--una-accent)}
.metodo h3 em{font-style:italic;font-weight:400;color:var(--una-gold)}
.cover-res .kpis{grid-template-columns:repeat(4,minmax(0,1fr));margin:22px 0 0}
.cover-hero{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:40px;padding:40px clamp(24px,4vw,56px) 36px;background-color:var(--una-panel);background-image:linear-gradient(rgba(6,37,75,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(6,37,75,.035) 1px,transparent 1px);background-size:50px 50px;border:1px solid var(--una-border);border-top:2px solid var(--una-gold);border-radius:var(--una-radius);box-shadow:var(--una-shadow-rest);color:var(--una-text)}
.cover-hero::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 88% 0%,rgba(14,165,233,.08),transparent 50%),radial-gradient(circle at 0% 100%,rgba(253,195,0,.07),transparent 45%);pointer-events:none}
.cover-hero>*{position:relative;z-index:1}
.cover-top{display:flex;align-items:center;gap:16px}
.cover-top svg path{fill:var(--una-strong)}
.cover-top span{font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--una-label);line-height:1.6}
.cover-hero h1{margin-top:18px;max-width:22ch;font-family:var(--una-font-display);font-size:clamp(34px,4vw,60px);font-weight:500;line-height:1.04;letter-spacing:-.015em;color:var(--una-strong)}
.cover-hero .sub{margin-top:22px;padding-left:18px;border-left:1px solid var(--una-gold);font-size:15px;font-weight:400;line-height:1.7;color:var(--una-text-2)}
.cover-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;max-width:640px;padding-top:20px;border-top:1px dashed var(--una-hairline-ui)}
.cover-meta dt{font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--una-label)}
.cover-meta dd{margin-top:6px;font-family:var(--una-font-display);font-style:italic;font-size:18px;color:var(--una-accent)}
.dots{position:absolute;right:32px;top:36px;opacity:.12;z-index:0}
.dots circle{fill:var(--una-strong)}
/* Imagen del producto al 50% de opacidad, anclada a la derecha */
/* #BAD3DF es el azul plano del fondo de ambas imagenes: rellena sin cortes
   el area que la imagen no cubre (p. ej. en movil). */
.cover-hero.con-imagen::before{content:'';position:absolute;inset:0;background-color:#BAD3DF;background-image:var(--cover-img);background-size:cover;background-position:right center;opacity:.5;pointer-events:none}
.cover-hero.con-imagen .dots{display:none}

/* KPI: etiqueta con rombo cian, valor en Playfair, delta en mono */
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin:28px 0}
.kpi{position:relative;overflow:hidden;background:var(--una-panel);border:1px solid var(--una-border);border-radius:var(--una-radius);padding:22px 22px 18px;box-shadow:var(--una-shadow-rest);transition:transform .3s var(--una-ease),box-shadow .3s var(--una-ease)}
.kpi::before,.card::before{content:'';position:absolute;inset:0 0 auto 0;height:2px;background:var(--una-gold);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--una-ease)}
.kpi:hover,.card:hover{transform:translateY(-2px);box-shadow:var(--una-shadow-hover)}
.kpi:hover::before,.card:hover::before{transform:scaleX(1)}
.kpi .lbl{display:flex;align-items:center;gap:10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;line-height:1.4;color:var(--una-label)}
.kpi .lbl::before{content:'';width:7px;height:7px;background:var(--una-cyan);transform:rotate(45deg);flex:0 0 auto}
.kpi .val{font-family:var(--una-font-display);font-size:clamp(30px,2.8vw,40px);font-weight:500;letter-spacing:-.02em;line-height:1.05;color:var(--una-strong);margin:14px 0 12px;font-variant-numeric:lining-nums tabular-nums}
.kpi .val small{font-size:17px;font-style:italic;font-weight:400;letter-spacing:0;color:var(--una-accent)}
.kpi .delta{font-family:var(--una-font-num);font-size:12px;font-weight:700;color:var(--una-muted);padding-top:12px;border-top:1px solid var(--una-hairline)}
.kpi .delta.up{color:var(--una-up)}.kpi .delta.dn{color:var(--una-down)}
.kpi .note{font-size:12px;color:var(--una-muted);margin-top:6px;line-height:1.5}

/* Encabezado de pagina: eyebrow + titulo Playfair, numero de pagina a la derecha */
.banda{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:22px;margin-bottom:6px;border-bottom:1px solid var(--una-hairline)}
.banda-t{display:flex;flex-direction:column;align-items:flex-start;gap:14px;min-width:0}
.banda h2{font-family:var(--una-font-display);font-size:clamp(28px,3vw,42px);font-weight:500;line-height:1.08;letter-spacing:-.01em;color:var(--una-strong)}
.banda .num{display:inline-flex;align-items:center;gap:12px;font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--una-accent)}
.banda .num::before{content:'';width:32px;height:1px;background:var(--una-gold-light);flex:0 0 auto}
.banda .pag{flex:0 0 auto;font-family:var(--una-font-num);font-size:12px;color:var(--una-label);white-space:nowrap}
.banda .pag b{font-family:var(--una-font-display);font-style:italic;font-weight:500;font-size:30px;color:var(--una-cyan);margin-right:4px}

/* Paneles de grafico (radio suave, barra dorada al pasar el cursor) */
.grid{display:grid;gap:18px;margin-top:18px}
.g2{grid-template-columns:1fr 1fr}
@media(max-width:880px){.g2{grid-template-columns:1fr}}
.card{position:relative;overflow:hidden;background:var(--una-panel);border:1px solid var(--una-border);border-radius:var(--una-radius-panel);padding:20px 22px 16px;margin-top:18px;box-shadow:var(--una-shadow-rest);transition:transform .3s var(--una-ease),box-shadow .3s var(--una-ease)}
.grid>.card{margin-top:0}
.card h3{font-family:var(--una-font-display);font-size:19px;font-weight:500;line-height:1.25;letter-spacing:-.01em;color:var(--una-strong)}
.card .desc{font-size:13px;line-height:1.6;color:var(--una-muted);margin:6px 0 14px}
.chart{position:relative;height:320px}
.chart.tall{height:380px}
.chart.short{height:280px}
canvas{max-width:100%}
.fuente{font-size:9.5px;font-weight:600;color:var(--una-caption);margin-top:12px;padding-top:10px;border-top:1px solid var(--una-hairline);text-transform:uppercase;letter-spacing:.2em}

details.como{margin-top:10px;border:1px solid var(--una-border);border-radius:var(--una-radius);background:#F8FAFC;font-size:13px}
details.como summary{cursor:pointer;padding:9px 14px;font-weight:700;color:var(--una-accent);font-size:12px;list-style:none;display:flex;align-items:center;gap:8px}
details.como summary::-webkit-details-marker{display:none}
details.como summary::before{content:'?';display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--una-accent);color:#fff;font-size:11px;font-weight:800;flex:0 0 auto}
details.como[open] summary{border-bottom:1px solid var(--una-border)}
details.como .cuerpo{padding:12px 16px 14px;color:var(--una-text)}
details.como .cuerpo p{margin-bottom:8px}
details.como .cuerpo p:last-child{margin-bottom:0}
details.como strong{color:var(--una-strong)}

/* Filtros: chips cuadrados en mayusculas (activo en cian) */
.ctrl{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px;align-items:center}
.ctrl .lblc{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.28em;color:var(--una-label);margin-right:6px}
.ctrl button{font-family:var(--una-font-ui);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:7px 12px;border-radius:var(--una-radius);border:1px solid var(--una-border);background:var(--una-panel);color:#64748b;cursor:pointer;font-variant-numeric:tabular-nums;transition:background .2s ease,border-color .2s ease,color .2s ease}
.ctrl button:hover{border-color:var(--una-cyan);color:var(--una-strong)}
.ctrl button.on{background:var(--una-cyan);border-color:var(--una-cyan);color:#fff}
.ctrl button.all{border-color:var(--una-hairline-ui);color:var(--una-muted)}
.ctrl button.all.on{background:var(--una-muted);color:#fff;border-color:var(--una-muted)}
.ctrl button:focus-visible{outline:2px solid rgba(14,165,233,.3);outline-offset:2px;border-color:var(--una-cyan)}
.hintc{font-size:11px;color:var(--una-caption);margin:-4px 0 8px}

.heat-wrap{overflow-x:auto}
/* table-layout fijo: reparte las 12 columnas por igual para que todos los
   mapas de calor queden con la misma proporcion, sin importar si una celda
   dice "n/d" o "+27.7%". */
.heat-table{width:100%;min-width:430px;table-layout:fixed;border-collapse:separate;border-spacing:2px;font-family:var(--una-font-num);font-size:10px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.heat-table th{font-family:var(--una-font-ui);font-size:9px;font-weight:700;color:var(--una-label);text-transform:uppercase;letter-spacing:.06em;padding:2px 0 4px;text-align:center}
.heat-table th.yr-col,.heat-table td.yr{width:38px}
.heat-table td.yr{font-size:10.5px;font-weight:700;color:var(--una-strong);text-align:right;padding-right:6px;white-space:nowrap}
.heat-cell{border-radius:var(--una-radius);text-align:center;padding:9px 1px;font-weight:500;white-space:nowrap}
.heat-cell.empty{background:${HEAT_V3.vacio}!important;color:${HEAT_V3.vacioTexto};font-weight:400;font-size:10px}

/* Tabla de datos (patron admin-table en claro) */
.tabla-wrap{overflow-x:auto}
table.datos{width:100%;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums}
table.datos th{background:var(--una-panel);color:#64748b;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;padding:12px 14px;text-align:left;position:sticky;top:0;border-bottom:1px solid rgba(0,0,0,.08);white-space:nowrap}
table.datos td{padding:12px 14px;border-bottom:1px solid rgba(0,0,0,.05);color:var(--una-text)}
table.datos tbody tr:nth-child(even){background:rgba(14,165,233,.03)}
table.datos tbody tr:hover{background:rgba(0,0,0,.02)}
table.datos th.n{text-align:right}
table.datos td.n{text-align:right;font-family:var(--una-font-num);font-size:12px}

/* Lectura: texto editorial con regla dorada */
.lectura{background:var(--una-panel);border:1px solid var(--una-border);border-left:3px solid var(--una-gold);border-radius:var(--una-radius);padding:20px 26px;margin-top:18px;font-size:15px;line-height:1.75;color:var(--una-text)}
.lectura strong{color:var(--una-strong);font-weight:700}
.lectura ul{margin:8px 0 0 18px}
.lectura li{margin-bottom:6px}

/* Nota metodologica: panel oscuro CME */
.metodo{color:var(--una-on-dark-2);border:1px solid var(--una-hairline-dark);border-radius:var(--una-radius);padding:36px 40px;margin-top:24px;font-size:14px;line-height:1.7}
.metodo h3{font-family:var(--una-font-display);color:#fff;font-size:clamp(28px,3vw,40px);font-weight:500;letter-spacing:-.01em;line-height:1.1;margin-bottom:18px}
.metodo p{margin-bottom:12px}
.metodo p:last-child{margin-bottom:0}
.badge-r{display:inline-flex;align-items:center;background:rgba(14,165,233,.12);border:1px solid rgba(14,165,233,.2);color:var(--una-cyan);padding:3px 9px;border-radius:var(--una-radius);font-size:9.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;vertical-align:1px}

.cofece{background:var(--una-panel);border:1px solid var(--una-border);border-radius:var(--una-radius);margin:24px 0 10px;padding:22px 26px;font-size:12.5px;line-height:1.7;color:var(--una-muted)}
.cofece h4{display:flex;align-items:center;gap:12px;color:var(--una-accent);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;margin-bottom:10px}
.cofece h4::before{content:'';width:32px;height:1px;background:var(--una-gold-light);flex:0 0 auto}
footer{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:center;background:var(--una-navy);border-top:1px solid var(--una-hairline-dark);color:var(--una-on-dark-3);padding:22px clamp(20px,4vw,56px);font-size:11px;letter-spacing:.04em}

/* Aviso: estado "pendiente" del sistema */
.aviso{background:rgba(253,195,0,.08);border:1px solid rgba(253,195,0,.35);border-left:3px solid var(--una-gold);border-radius:var(--una-radius);padding:14px 20px;margin-top:18px;font-size:13.5px;line-height:1.65;color:var(--una-text)}
.aviso strong{color:${V3.pendingText}}

@media(max-width:1180px){
  .cover-res .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:1023px){
  :root{--side-w:0px}
  .side{width:min(300px,86vw);transform:translateX(-100%);transition:transform .3s var(--una-ease)}
  body.nav-open .side{transform:none;box-shadow:0 40px 80px rgba(0,0,0,.5)}
  body.nav-open .side-backdrop{display:block;position:fixed;inset:0;z-index:85;background:rgba(3,7,18,.6);backdrop-filter:blur(4px)}
  .topbar{display:flex;position:sticky;top:0;z-index:80;align-items:center;gap:14px;height:56px;padding:0 16px;background:rgba(11,21,40,.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--una-hairline-dark);color:#fff}
  .menu-btn{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid var(--una-hairline-dark-ui);border-radius:var(--una-radius);background:transparent;color:var(--una-on-dark);cursor:pointer}
  .menu-btn:focus-visible{outline:2px solid var(--una-cyan);outline-offset:2px}
  .topbar-t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:var(--una-font-display);font-size:16px}
  .topbar-pag{font-family:var(--una-font-num);font-size:12px;color:var(--una-on-dark-2)}
  .page{min-height:auto;padding:40px 16px 48px;scroll-margin-top:56px}
  .cover-hero{padding:28px 20px 24px;gap:28px}
  .dots{display:none}
  .banda .pag b{font-size:24px}
}
@media(max-width:640px){
  .cover-hero.con-imagen::before{background-size:190% auto;background-position:88% 100%;background-repeat:no-repeat}
  .cover-res .kpis{grid-template-columns:1fr}
  .cover-meta{grid-template-columns:1fr 1fr}
  .metodo{padding:28px 22px}
}
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{transition:none!important;animation:none!important}
  .kpi:hover,.card:hover{transform:none}
}
@media print{
  .side,.side-backdrop,.topbar,.skip{display:none!important}
  .main{margin-left:0}
  .page{min-height:auto;padding:24px 0;border:0;break-before:page}
  .cover{break-before:auto}
  .cover-hero{box-shadow:none;break-inside:avoid}
  /* Chart.js no se redimensiona al imprimir: el grafico ya dibujado se escala
     al ancho de la hoja conservando su proporcion. */
  .chart{height:auto!important}
  .chart canvas{width:100%!important;height:auto!important}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .kpi,.card{box-shadow:none;transform:none!important;break-inside:avoid}
}
`;

// Logotipo oficial de la UNA (version vertical, trazos claros para fondo
// oscuro). Se lee de assets/ y se incrusta en el HTML para que el reporte siga
// siendo un archivo autocontenido.
const LOGO_SVG = readFileSync(new URL('../assets/logo-una-vertical.svg', import.meta.url), 'utf8');
const LOGO_VIEWBOX = LOGO_SVG.match(/viewBox="([^"]+)"/)[1];
const LOGO_TRAZOS = LOGO_SVG.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
const [, , LOGO_W, LOGO_H] = LOGO_VIEWBOX.split(/\s+/).map(Number);

export const logo = (ancho = 48, decorativo = false) =>
  `<svg width="${ancho}" height="${Math.round((ancho * LOGO_H) / LOGO_W)}" viewBox="${LOGO_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg" ${decorativo ? 'aria-hidden="true"' : 'role="img" aria-label="Unión Nacional de Avicultores"'}>${LOGO_TRAZOS}</svg>`;

// Imagen de fondo del cover por producto: assets/portada-<producto>.webp. Se
// incrusta como data URI para que el reporte siga siendo autocontenido; si no
// existe imagen para el producto, el cover queda sin fondo. Se asigna desde un
// <script data-portada>: scripts/validar.mjs busca "NaN"/"undefined" fuera de
// los scripts y el base64 puede contener esas letras por azar.
function imagenPortada(producto) {
  if (!producto) return '';
  const url = new URL(`../assets/portada-${producto}.webp`, import.meta.url);
  return existsSync(url) ? `data:image/webp;base64,${readFileSync(url).toString('base64')}` : '';
}

const DOTS = `<svg class="dots" aria-hidden="true" width="190" height="78" viewBox="0 0 190 78" xmlns="http://www.w3.org/2000/svg">
${Array.from({ length: 6 }, (_, f) =>
  Array.from({ length: 14 }, (_, c) => `<circle cx="${6 + c * 14}" cy="${6 + f * 14}" r="2.3" fill="#fff" opacity="0.45"/>`).join('')
).join('')}</svg>`;

// Navegacion del reporte: marca en el sidebar la pagina visible, actualiza el
// contador de la barra movil y abre y cierra el indice en pantallas chicas.
// Va en <script data-nav>, aparte del script de datos: scripts/validar.mjs
// solo ejecuta el ultimo <script> sin atributos.
const NAV_JS = `(() => {
  const body = document.body;
  const enlaces = [...document.querySelectorAll('.side-nav a')];
  const paginas = enlaces.map((a) => document.getElementById(a.hash.slice(1)));
  const contador = document.querySelector('[data-pag]');
  const dos = (n) => String(n).padStart(2, '0');
  const total = dos(paginas.length - 1);
  let activa = -1;

  const marcar = (i) => {
    if (i === activa) return;
    activa = i;
    enlaces.forEach((a, j) => {
      a.classList.toggle('on', j === i);
      if (j === i) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (contador) contador.textContent = dos(i) + ' / ' + total;
  };
  // La pagina activa es la ultima cuyo borde superior ya cruzo el 35% de la
  // ventana; al llegar al final se marca la ultima aunque sea corta.
  const calcular = () => {
    const corte = innerHeight * 0.35;
    let i = 0;
    paginas.forEach((p, j) => { if (p && p.getBoundingClientRect().top <= corte) i = j; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) i = paginas.length - 1;
    marcar(i);
  };
  // Son unas diez mediciones por evento: se calcula directo, sin esperar a
  // requestAnimationFrame (que se pausa en pestañas ocultas).
  addEventListener('scroll', calcular, { passive: true });
  addEventListener('resize', calcular);
  calcular();

  // Indice en pantallas chicas: el sidebar sale como panel lateral.
  const boton = document.querySelector('.menu-btn');
  const lateral = document.getElementById('side');
  const movil = matchMedia('(max-width: 1023px)');
  const abierto = () => body.classList.contains('nav-open');
  const sincronizar = () => { lateral.inert = movil.matches && !abierto(); };
  const abrir = (si, devolverFoco = true) => {
    body.classList.toggle('nav-open', si);
    boton.setAttribute('aria-expanded', String(si));
    boton.setAttribute('aria-label', si ? 'Cerrar índice de páginas' : 'Abrir índice de páginas');
    sincronizar();
    if (si) (enlaces[activa] || enlaces[0]).focus();
    else if (devolverFoco) boton.focus();
  };
  boton.addEventListener('click', () => abrir(!abierto()));
  document.querySelector('[data-nav-cerrar]').addEventListener('click', () => abrir(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto()) abrir(false); });
  enlaces.forEach((a) => a.addEventListener('click', () => { if (abierto()) abrir(false, false); }));
  movil.addEventListener('change', () => { if (!movil.matches && abierto()) abrir(false, false); sincronizar(); });
  sincronizar();
})();`;

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

const pad2 = (n) => String(n).padStart(2, '0');

// Encabezado de pagina. `pagina` = { actual, total } agrega el contador "01 / 08".
export function banda(titulo, numero, pagina = null) {
  const pag = pagina ? `<span class="pag"><b>${pad2(pagina.actual)}</b>/ ${pad2(pagina.total)}</span>` : '';
  return `<div class="banda"><div class="banda-t"><span class="num">${esc(numero)}</span><h2>${esc(titulo)}</h2></div>${pag}</div>`;
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
  const head = columnas.map((c) => `<th${c.num ? ' class="n"' : ''}>${esc(c.label)}</th>`).join('');
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

export function documento({ titulo, h1, subtitulo, nav: navItems, secciones, datos, scripts, metodologia, resumen = {}, portada = {} }) {
  const total = navItems.length - 1;
  const navHtml = navItems
    .map((n, i) => `<a href="#${esc(n.id)}"><span class="pn">${pad2(i)}</span><span>${esc(n.label)}</span></a>`)
    .join('');
  const fondo = imagenPortada(portada.producto);
  const meta = (portada.meta ?? []).map((m) => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.valor)}</dd></div>`).join('');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FUENTES.url}" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#contenido">Saltar al contenido</a>
<aside class="side" id="side" aria-label="Páginas del reporte">
  <a class="side-brand" href="#resumen">${logo(24, true)}<span><span class="t1">Unión Nacional de Avicultores</span><span class="t2">${esc(portada.corto ?? titulo)}</span></span></a>
  <div class="side-label">Contenido</div>
  <nav class="side-nav">${navHtml}</nav>
  ${portada.datosA ? `<div class="side-foot">Datos a<strong>${esc(portada.datosA)}</strong></div>` : ''}
</aside>
<div class="side-backdrop" data-nav-cerrar></div>
<div class="topbar">
  <button class="menu-btn" type="button" aria-controls="side" aria-expanded="false" aria-label="Abrir índice de páginas"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
  <span class="topbar-t">${esc(portada.corto ?? titulo)}</span>
  <span class="topbar-pag" data-pag>${pad2(0)} / ${pad2(total)}</span>
</div>
<main class="main" id="contenido">
<section class="page cover" id="resumen"><div class="page-in">
  <div class="cover-hero${fondo ? ' con-imagen' : ''}">
    <div class="cover-top">${logo(40)}<span>Unión Nacional de Avicultores</span></div>
    <div>
      <span class="eyebrow">${esc(portada.eyebrow ?? 'Reporte analítico')}</span>
      <h1>${h1}</h1>
      <div class="sub">${esc(subtitulo)}</div>
    </div>
    ${meta ? `<dl class="cover-meta">${meta}</dl>` : ''}
    ${DOTS}
  </div>
  ${fondo ? `<script data-portada>document.currentScript.previousElementSibling.style.setProperty('--cover-img', "url('${fondo}')");</script>` : ''}
  <div class="cover-res">
    <span class="eyebrow">${pad2(0)} · ${esc(navItems[0]?.label ?? 'Resumen')}</span>
    <h2>Indicadores <em>clave</em>.</h2>
    <div class="kpis">${resumen.kpis ?? ''}</div>
    ${resumen.lectura ? `<div class="lectura">${resumen.lectura}</div>` : ''}
  </div>
</div></section>
${secciones}
<section class="page" id="nota">
<div class="page-in">
${metodologia || ''}
<div class="cofece">
  <h4>Declaracion antimonopolio</h4>
  <p>Este documento tiene fines exclusivamente informativos y estadisticos. La informacion es historica y agregada; no constituye una recomendacion de precios ni un acuerdo entre competidores. Cada participante determina su conducta comercial de forma independiente.</p>
</div>
</div>
</section>
<footer>
  <span>Union Nacional de Avicultores &middot; Reporte generado automaticamente</span>
  <span>Datos en vivo desde la base de datos institucional</span>
</footer>
</main>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
const DATOS = ${JSON.stringify(datos)};
Chart.defaults.font.family = ${JSON.stringify(FUENTES.ui)};
Chart.defaults.font.size = 11.5;
Chart.defaults.color = '${V3.textMuted}';
Chart.defaults.plugins.legend.labels.boxWidth = 10;
Chart.defaults.plugins.legend.labels.boxHeight = 10;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.color = '${V3.text2}';
Chart.defaults.plugins.legend.labels.padding = 14;
// Tooltip claro del sistema (§10.10): panel blanco con borde y etiqueta #1A2B4A.
Chart.defaults.plugins.tooltip.backgroundColor = '#FFFFFF';
Chart.defaults.plugins.tooltip.borderColor = '${V3.panelBorder}';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.titleColor = '${V3.panelTitle}';
Chart.defaults.plugins.tooltip.bodyColor = '${V3.text}';
Chart.defaults.plugins.tooltip.usePointStyle = true;
Chart.defaults.plugins.tooltip.boxPadding = 4;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
// Rejilla punteada y ejes recesivos. Chart.defaults.scale no existe en el
// stub del validador, por eso va condicionado.
if (Chart.defaults.scale) {
  Chart.defaults.scale.grid.color = '${V3.panelBorder}';
  Chart.defaults.scale.border.dash = [3, 3];
  Chart.defaults.scale.border.color = '${V3.panelBorder}';
}
Chart.defaults.maintainAspectRatio = false;
const fmt = (v, d = 0) => v === null || v === undefined ? '—' : Number(v).toLocaleString('es-MX', {minimumFractionDigits: d, maximumFractionDigits: d});
const fmtC = (v) => { if (v === null || v === undefined) return '—'; const a = Math.abs(v);
  if (a >= 1e9) return (v/1e9).toFixed(2)+' MM'; if (a >= 1e6) return (v/1e6).toFixed(1)+' M';
  if (a >= 1e3) return (v/1e3).toFixed(0)+' mil'; return fmt(v); };
const ejeMoneda = { ticks: { callback: (v) => '$' + fmt(v, 0) } };
const ejeCompacto = { ticks: { callback: (v) => fmtC(v) } };
${scripts}
</script>
<script data-nav>${NAV_JS}</script>
</body>
</html>`;
}
