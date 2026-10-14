// Interfaz minima con el boton de generacion.
//   node server.js   ->  http://localhost:5173
//
// Sin dependencias externas: usa el modulo http de Node.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generar } from './generate.js';
import { healthCheck } from './src/api.js';
import { logo } from './src/html.js';
import { UI_PORT, BACKEND_URL, V3, FUENTES } from './config.js';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const SALIDA = join(RAIZ, 'out');

const REPORTES = [
  { id: 'huevo', titulo: 'Reporte de Huevo', desc: 'Precio al productor, parvada de postura, venta de pollita, comercio exterior y correlación pollita-precio.' },
  { id: 'pollo', titulo: 'Reporte de Pollo', desc: 'Precio por categoría, mapas de calor, reproductoras pesadas, producción y comercio exterior.' },
];

async function infoArchivo(id) {
  try {
    const s = await stat(join(SALIDA, `reporte_${id}.html`));
    return { existe: true, fecha: s.mtime.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) };
  } catch {
    return { existe: false, fecha: null };
  }
}

async function paginaInicio() {
  const vivo = await healthCheck();
  const tarjetas = await Promise.all(
    REPORTES.map(async (r, i) => {
      const info = await infoArchivo(r.id);
      return `<article class="rep">
        <div class="rep-head"><span class="rk">${String(i + 1).padStart(2, '0')}</span><h2>${r.titulo}</h2></div>
        <p>${r.desc}</p>
        <div class="rep-pie">
          <div class="estado">${info.existe ? `Última generación: <strong>${info.fecha}</strong>` : 'Aún no se ha generado'}</div>
          <div class="acciones">
            <button data-id="${r.id}" ${vivo ? '' : 'disabled'}>Generar con datos actuales</button>
            ${info.existe ? `<a class="ver" href="/ver/${r.id}" target="_blank">Ver reporte</a>` : ''}
          </div>
        </div>
      </article>`;
    })
  );

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Generador de reportes UNA</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FUENTES.url}" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${FUENTES.ui};background:${V3.pageBg};color:${V3.text};line-height:1.6;-webkit-font-smoothing:antialiased}
::selection{background:${V3.yellow};color:${V3.brandDark}}
.in{max-width:960px;margin:0 auto;padding:0 24px}

/* Cabecera oscura CME: rejilla de 50px y brillo cian */
header{position:relative;overflow:hidden;color:#fff;border-bottom:1px solid ${V3.hairlineDark};background-color:${V3.brandNavy};background-image:radial-gradient(circle at 85% 0%,rgba(14,165,233,.16),transparent 55%),linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:auto,50px 50px,50px 50px}
header .in{padding-top:40px;padding-bottom:56px}
.marca{display:flex;align-items:center;gap:14px;font-size:10px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:${V3.textOnDark2}}
.eyebrow{display:inline-flex;align-items:center;gap:12px;margin-top:48px;font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:${V3.yellow}}
.eyebrow::before{content:'';width:32px;height:1px;background:${V3.cyan}}
header h1{margin-top:16px;font-family:${FUENTES.display};font-size:clamp(36px,5vw,56px);font-weight:500;line-height:1.05;letter-spacing:-.01em}
header h1 em{font-style:italic;font-weight:400;color:${V3.yellow}}
header .sub{margin-top:20px;padding-left:18px;border-left:1px solid rgba(253,195,0,.4);color:rgba(255,255,255,.75);font-size:15px;font-weight:300}

main{max-width:960px;margin:-28px auto 56px;padding:0 24px;position:relative}

/* Estado del backend: etiqueta con punto en vivo */
.aviso{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid ${V3.panelBorder};border-left:3px solid;border-radius:${V3.radius};padding:14px 20px;margin-bottom:24px;font-size:13.5px;font-weight:500;box-shadow:${V3.shadowRest}}
.aviso::before{content:'';width:8px;height:8px;border-radius:50%;flex:0 0 auto;background:currentColor;box-shadow:0 0 0 0 currentColor;animation:pulso 2s infinite}
.ok{border-left-color:${V3.up};color:${V3.okText}}
.mal{border-left-color:${V3.down};color:${V3.errorText}}
@keyframes pulso{0%{box-shadow:0 0 0 0 color-mix(in srgb,currentColor 45%,transparent)}70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}

/* Tarjetas de reporte */
.rep{position:relative;overflow:hidden;background:#fff;border:1px solid ${V3.panelBorder};border-radius:${V3.radius};padding:26px 28px 22px;margin-bottom:18px;box-shadow:${V3.shadowRest};transition:transform .3s ${V3.ease},box-shadow .3s ${V3.ease}}
.rep::before{content:'';position:absolute;inset:0 0 auto 0;height:2px;background:${V3.yellow};transform:scaleX(0);transform-origin:left;transition:transform .4s ${V3.ease}}
.rep:hover{transform:translateY(-2px);box-shadow:${V3.shadowHover}}
.rep:hover::before{transform:scaleX(1)}
.rep-head{display:flex;align-items:baseline;gap:14px}
.rk{font-family:${FUENTES.display};font-style:italic;font-size:18px;color:${V3.cyan}}
.rep h2{font-family:${FUENTES.display};font-size:26px;font-weight:500;letter-spacing:-.01em;line-height:1.15;color:${V3.navyDeep}}
.rep p{color:${V3.textMuted};font-size:14px;line-height:1.7;margin:8px 0 20px 32px}
.rep-pie{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding-top:18px;border-top:1px solid ${V3.hairline};margin-left:32px}
.estado{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:${V3.fieldLabel}}
.estado strong{display:block;margin-top:4px;font-family:${FUENTES.num};font-size:12.5px;font-weight:500;letter-spacing:0;text-transform:none;color:${V3.text}}
.acciones{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
button,a.ver{display:inline-flex;align-items:center;justify-content:center;font-family:${FUENTES.ui};font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;padding:14px 22px;border-radius:${V3.radius};text-decoration:none;cursor:pointer;transition:background .2s ease,border-color .2s ease,color .2s ease}
button{border:0;background:${V3.cyan};color:${V3.brandDark}}
button:hover:not(:disabled){background:${V3.cyanHover}}
button:disabled{background:#E2E8F0;color:#94a3b8;cursor:not-allowed}
a.ver{border:1px solid ${V3.navyDeep};color:${V3.navyDeep};background:transparent}
a.ver:hover{background:${V3.navyDeep};color:#fff}
button:focus-visible,a.ver:focus-visible{outline:2px solid rgba(14,165,233,.3);outline-offset:2px}

/* Bitacora de generacion: panel oscuro en mono */
.log{background:${V3.brandNavy};border:1px solid ${V3.hairlineDark};border-left:3px solid ${V3.cyan};color:${V3.textOnDark};border-radius:${V3.radius};padding:16px 20px;font-family:${FUENTES.num};font-size:12.5px;line-height:1.7;white-space:pre-wrap;margin-top:24px;display:none}
.log.on{display:block}

@media(max-width:640px){
  .rep{padding:22px 20px 18px}
  .rep p,.rep-pie{margin-left:0}
  .acciones{width:100%;flex-direction:column;align-items:stretch}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{transition:none!important;animation:none!important}
  .rep:hover{transform:none}
}
</style></head><body>
<header><div class="in">
<div class="marca">${logo(28)}<span>Unión Nacional de Avicultores</span></div>
<span class="eyebrow">Market intelligence</span>
<h1>Generador de <em>reportes</em> UNA</h1>
<div class="sub">Consulta la base de datos institucional y arma el reporte en HTML</div>
</div></header>
<main>
  <div class="aviso ${vivo ? 'ok' : 'mal'}">${vivo
    ? `Backend conectado en ${BACKEND_URL}`
    : `Backend no disponible en ${BACKEND_URL}. Enciéndelo para poder generar los reportes.`}</div>
  ${tarjetas.join('')}
  <div class="log" id="log"></div>
</main>
<script>
const log = document.getElementById('log');
document.querySelectorAll('button[data-id]').forEach((b) => {
  b.addEventListener('click', async () => {
    const id = b.dataset.id;
    const original = b.textContent;
    document.querySelectorAll('button[data-id]').forEach((x) => x.disabled = true);
    b.textContent = 'Consultando base de datos...';
    log.classList.add('on');
    log.textContent = 'Generando reporte de ' + id + '. Esto consulta varias series historicas, puede tardar un momento...';
    try {
      const res = await fetch('/generar/' + id, { method: 'POST' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Error desconocido');
      log.textContent = 'Listo: ' + data.archivo;
      location.reload();
    } catch (err) {
      log.textContent = 'Error: ' + err.message;
      document.querySelectorAll('button[data-id]').forEach((x) => x.disabled = false);
      b.textContent = original;
    }
  });
});
</script></body></html>`;
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${UI_PORT}`);

  try {
    if (url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(await paginaInicio());
    }

    if (url.pathname.startsWith('/generar/') && req.method === 'POST') {
      const id = url.pathname.split('/')[2];
      const [r] = await generar([id]);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, archivo: r.archivo }));
    }

    if (url.pathname.startsWith('/ver/')) {
      const id = url.pathname.split('/')[2];
      const html = await readFile(join(SALIDA, `reporte_${id}.html`), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: err.message }));
  }
});

servidor.listen(UI_PORT, () => {
  console.log(`\nGenerador de reportes UNA`);
  console.log(`  Interfaz:  http://localhost:${UI_PORT}`);
  console.log(`  Backend:   ${BACKEND_URL}\n`);
});
