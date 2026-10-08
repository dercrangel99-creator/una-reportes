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
import { UI_PORT, BACKEND_URL, UNA } from './config.js';

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
    REPORTES.map(async (r) => {
      const info = await infoArchivo(r.id);
      return `<article class="rep">
        <h2>${r.titulo}</h2>
        <p>${r.desc}</p>
        <div class="estado">${info.existe ? `Última generación: <strong>${info.fecha}</strong>` : 'Aún no se ha generado'}</div>
        <div class="acciones">
          <button data-id="${r.id}" ${vivo ? '' : 'disabled'}>Generar con datos actuales</button>
          ${info.existe ? `<a class="ver" href="/ver/${r.id}" target="_blank">Ver reporte</a>` : ''}
        </div>
      </article>`;
    })
  );

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Generador de reportes UNA</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Poppins',system-ui,sans-serif;background:${UNA.bgLight};color:${UNA.textDark};line-height:1.55}
header{background:${UNA.navyDeep};color:#fff;padding:30px 24px}
header h1{font-size:26px;font-weight:800;text-transform:uppercase;letter-spacing:.5px}
header .sub{color:#A9C5E8;font-size:14px;margin-top:6px}
.raya{width:56px;height:5px;background:${UNA.accentYellow};margin-top:12px;border-radius:2px}
main{max-width:900px;margin:28px auto;padding:0 24px}
.aviso{border-radius:10px;padding:13px 18px;font-size:14px;margin-bottom:22px;font-weight:600}
.ok{background:#E8F5EC;border:1px solid ${UNA.green};color:${UNA.green}}
.mal{background:#FDECEC;border:1px solid ${UNA.red};color:${UNA.red}}
.rep{background:#fff;border:1px solid ${UNA.line};border-top:5px solid ${UNA.navyPrimary};border-radius:12px;padding:20px 22px;margin-bottom:18px}
.rep h2{font-size:17px;color:${UNA.navyDeep};text-transform:uppercase;letter-spacing:.4px;font-weight:800}
.rep p{color:${UNA.textMuted};font-size:14px;margin:7px 0 12px}
.estado{font-size:12.5px;color:${UNA.textMuted};margin-bottom:12px}
.acciones{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
button{font:inherit;font-weight:700;font-size:13.5px;padding:10px 20px;border-radius:8px;border:none;background:${UNA.navyPrimary};color:#fff;cursor:pointer}
button:hover:not(:disabled){background:${UNA.navyDeep}}
button:disabled{background:#B9C6D6;cursor:not-allowed}
a.ver{font-weight:700;font-size:13.5px;padding:10px 20px;border-radius:8px;border:1.5px solid ${UNA.navyPrimary};color:${UNA.navyPrimary};text-decoration:none}
a.ver:hover{background:${UNA.navyPrimary};color:#fff}
.log{background:${UNA.navyDeep};color:#CFE2F5;border-radius:10px;padding:14px 18px;font-family:ui-monospace,monospace;font-size:12.5px;white-space:pre-wrap;margin-top:18px;display:none}
.log.on{display:block}
</style></head><body>
<header><h1>Generador de reportes UNA</h1>
<div class="sub">Consulta la base de datos institucional y arma el reporte en HTML</div><div class="raya"></div></header>
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
