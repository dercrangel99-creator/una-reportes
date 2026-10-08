// Generadores de codigo Chart.js. Cada funcion devuelve el string JS que
// inicializa un grafico leyendo su serie desde el objeto DATOS embebido.

import { SERIE_COLORS, UNA } from '../config.js';

const color = (i) => SERIE_COLORS[i % SERIE_COLORS.length];
const j = (v) => JSON.stringify(v);

const GRID = `{ color: 'rgba(6,37,75,.07)' }`;

// Linea simple o multiple. series: [{key,label,color?,dash?,relleno?}]
export function linea({ id, datosKey, labelsKey = 'labels', series, eje = '', moneda = false, compacto = false }) {
  const ds = series
    .map(
      (s, i) => `{
      label: ${j(s.label)},
      data: D[${j(s.key)}],
      borderColor: ${j(s.color || color(i))},
      backgroundColor: ${j((s.color || color(i)) + '22')},
      borderWidth: ${s.ancho || 2.4},
      borderDash: ${j(s.dash || [])},
      pointRadius: ${s.puntos === false ? 0 : 0},
      pointHoverRadius: 4,
      tension: .3,
      fill: ${s.relleno ? 'true' : 'false'},
      spanGaps: true
    }`
    )
    .join(',');
  return `(() => { const D = DATOS.${datosKey};
  new Chart(document.getElementById(${j(id)}), {
    type: 'line',
    data: { labels: D[${j(labelsKey)}], datasets: [${ds}] },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: ${series.length > 1}, position: 'bottom' },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + ${moneda ? `'$' + fmt(c.parsed.y, 2)` : compacto ? `fmtC(c.parsed.y)` : `fmt(c.parsed.y, 1)`} } } },
      scales: { x: { grid: { display: false } },
        y: { grid: ${GRID}, title: { display: ${!!eje}, text: ${j(eje)} }, ...(${moneda ? 'ejeMoneda' : compacto ? 'ejeCompacto' : '{}'}) } }
    }
  }); })();`;
}

// Barras verticales u horizontales (una o varias series, opcionalmente apiladas).
// `decimales` fuerza un formato con decimales fijos, necesario para magnitudes
// pequeñas como USD/kg, donde el formato compacto redondearia a entero.
export function barras({ id, datosKey, labelsKey = 'labels', series, eje = '', moneda = false, compacto = true, apilado = false, horizontal = false, decimales = null, etiquetas = false }) {
  const ds = series
    .map(
      (s, i) => `{
      label: ${j(s.label)},
      data: D[${j(s.key)}],
      backgroundColor: ${j(s.color || color(i))},
      borderRadius: 4,
      borderSkipped: false
    }`
    )
    .join(',');

  const simbolo = moneda ? "'$' + " : '';
  const formatoValor =
    decimales !== null ? `(v) => ${simbolo}fmt(v, ${decimales})`
    : moneda ? `(v) => '$' + fmt(v, 2)`
    : compacto ? `(v) => fmtC(v)` : `(v) => fmt(v, 1)`;
  const ejeValor =
    decimales !== null
      ? `{ ticks: { callback: (v) => ${simbolo}fmt(v, ${decimales}) } }`
      : moneda ? 'ejeMoneda' : compacto ? 'ejeCompacto' : '{}';
  const valorTooltip = `c.parsed.${horizontal ? 'x' : 'y'}`;
  const tooltipValor =
    decimales !== null
      ? `${simbolo}fmt(${valorTooltip}, ${decimales})`
      : moneda ? `'$' + fmt(${valorTooltip}, 2)` : `fmtC(${valorTooltip})`;

  // En barras horizontales las categorias llevan nombres largos que Chart.js
  // recorta. Se reduce la fuente y se parten en dos lineas; ademas se escribe
  // el valor al final de cada barra para poder leerlo aunque la barra sea
  // diminuta frente a un valor atipico.
  const ticksCategoria = horizontal
    ? `, ticks: { font: { size: 10 }, autoSkip: false, callback: function(v) {
        const t = this.getLabelForValue(v);
        if (t.length <= 15) return t;
        const palabras = t.split(' '); const lineas = [''];
        for (const p of palabras) {
          const i = lineas.length - 1;
          if ((lineas[i] + ' ' + p).trim().length <= 15) lineas[i] = (lineas[i] + ' ' + p).trim();
          else lineas.push(p);
        }
        return lineas;
      } }`
    : '';

  const pluginEtiquetas = horizontal && etiquetas
    ? `[{ afterDatasetsDraw(ch) {
        const ctx = ch.ctx; ctx.save();
        ctx.font = '600 10px Poppins, system-ui, sans-serif';
        ctx.fillStyle = '${UNA.textMuted}'; ctx.textBaseline = 'middle';
        const f = ${formatoValor};
        ch.data.datasets.forEach((ds, di) => {
          const meta = ch.getDatasetMeta(di);
          if (meta.hidden) return;
          meta.data.forEach((el, i) => {
            const v = ds.data[i];
            if (v === null || v === undefined) return;
            ctx.fillText(f(v), el.x + 6, el.y);
          });
        });
        ctx.restore();
      } }]`
    : '[]';

  return `(() => { const D = DATOS.${datosKey};
  new Chart(document.getElementById(${j(id)}), {
    type: 'bar',
    data: { labels: D[${j(labelsKey)}], datasets: [${ds}] },
    plugins: ${pluginEtiquetas},
    options: {
      indexAxis: ${j(horizontal ? 'y' : 'x')},
      layout: { padding: { right: ${horizontal && etiquetas ? 54 : 0} } },
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: ${series.length > 1}, position: 'bottom' },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + ${tooltipValor} } } },
      scales: {
        x: { stacked: ${apilado}, grid: { display: ${horizontal} }, title: { display: ${!!eje && horizontal}, text: ${j(eje)} }, ...(${horizontal ? ejeValor : '{}'}) },
        y: { stacked: ${apilado}, grid: ${GRID}, title: { display: ${!!eje && !horizontal}, text: ${j(eje)} }${ticksCategoria}, ...(${!horizontal ? ejeValor : '{}'}) }
      }
    }
  }); })();`;
}

// Combo: barras (eje izquierdo) + linea (eje derecho).
// Chart.js dibuja los datasets en orden decreciente de `order`, asi que las
// barras llevan un `order` mayor para quedar al fondo y la linea uno menor
// para dibujarse encima. Sin esto la linea queda oculta tras las barras.
export function combo({ id, datosKey, labelsKey = 'labels', barras: b, lineas: l, ejeIzq = '', ejeDer = '' }) {
  // Si ninguna linea usa el eje derecho hay que ocultarlo: un eje sin datos
  // se dibuja igual, con una escala 0-1 que no significa nada.
  const usaEjeDer = l.some((s) => !s.ejeIzq);
  const dsB = b
    .map((s, i) => `{ type: 'bar', label: ${j(s.label)}, data: D[${j(s.key)}], backgroundColor: ${j(s.color || color(i))}, borderRadius: 4, yAxisID: 'y', order: 5 }`)
    .join(',');
  const dsL = l
    .map(
      (s, i) =>
        `{ type: 'line', label: ${j(s.label)}, data: D[${j(s.key)}], borderColor: ${j(s.color || color(i + b.length))}, backgroundColor: ${j(s.color || color(i + b.length))}, borderWidth: 3.2, borderDash: ${j(s.dash || [])}, pointRadius: 0, pointHoverRadius: 5, tension: .3, spanGaps: true, yAxisID: ${j(s.ejeIzq ? 'y' : 'y1')}, order: ${i + 1}, borderJoinStyle: 'round', borderCapStyle: 'round' }`
    )
    .join(',');
  return `(() => { const D = DATOS.${datosKey};
  new Chart(document.getElementById(${j(id)}), {
    data: { labels: D[${j(labelsKey)}], datasets: [${dsB}${dsB && dsL ? ',' : ''}${dsL}] },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom',
        // El 'order' de los datasets altera tambien el orden de la leyenda;
        // se reordena por indice para conservar el orden de declaracion.
        labels: { sort: (a, b) => a.datasetIndex - b.datasetIndex } } },
      scales: {
        x: { grid: { display: false } },
        y: { position: 'left', grid: ${GRID}, title: { display: ${!!ejeIzq}, text: ${j(ejeIzq)} }, ...ejeCompacto },
        y1: { display: ${usaEjeDer}, position: 'right', grid: { display: false }, title: { display: ${!!ejeDer && usaEjeDer}, text: ${j(ejeDer)} } }
      }
    }
  }); })();`;
}

// Dispersion (correlacion).
export function dispersion({ id, datosKey, label, ejeX = '', ejeY = '' }) {
  return `(() => { const D = DATOS.${datosKey};
  new Chart(document.getElementById(${j(id)}), {
    type: 'scatter',
    data: { datasets: [{ label: ${j(label)}, data: D.puntos, backgroundColor: ${j(UNA.navyPrimary)}, pointRadius: 4.5, pointHoverRadius: 6 }] },
    options: {
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: (c) => c.raw.t + ': (' + fmt(c.parsed.x,1) + ', ' + fmt(c.parsed.y,1) + ')' } } },
      scales: { x: { grid: ${GRID}, title: { display: true, text: ${j(ejeX)} } },
                y: { grid: ${GRID}, title: { display: true, text: ${j(ejeY)} } } }
    }
  }); })();`;
}

// Dona / participacion.
export function dona({ id, datosKey, moneda = false }) {
  return `(() => { const D = DATOS.${datosKey};
  new Chart(document.getElementById(${j(id)}), {
    type: 'doughnut',
    data: { labels: D.labels, datasets: [{ data: D.valores, backgroundColor: ${j(SERIE_COLORS)}, borderWidth: 2, borderColor: '#fff' }] },
    options: { cutout: '58%', plugins: { legend: { position: 'right' },
      tooltip: { callbacks: { label: (c) => c.label + ': ' + fmtC(c.parsed) + ' (' + (c.parsed / c.dataset.data.reduce((a,b)=>a+b,0) * 100).toFixed(1) + '%)' } } } }
  }); })();`;
}

// Grafico de lineas con selector de opcion (p.ej. producto). Los datos de
// todas las opciones van embebidos y el boton solo cambia el dataset activo.
// Forma esperada: DATOS[key] = { labels, opciones, series: { <opcion>: { <serie>: [...] } } }
export function lineaFiltrada({ id, ctrlId, datosKey, series, eje = '', moneda = false, decimales = null, etiquetaCtrl = 'Producto' }) {
  const simbolo = moneda ? "'$' + " : '';
  const formato =
    decimales !== null ? `(v) => ${simbolo}fmt(v, ${decimales})`
    : moneda ? `(v) => '$' + fmt(v, 2)` : `(v) => fmtC(v)`;
  const ejeValor =
    decimales !== null
      ? `{ ticks: { callback: (v) => ${simbolo}fmt(v, ${decimales}) } }`
      : moneda ? 'ejeMoneda' : 'ejeCompacto';

  const ds = series
    .map(
      (s, i) => `{
      label: ${j(s.label)},
      data: D.series[activa][${j(s.key)}],
      borderColor: ${j(s.color || color(i))},
      backgroundColor: ${j((s.color || color(i)) + '22')},
      borderWidth: 2.6, pointRadius: 0, pointHoverRadius: 5,
      tension: .3, spanGaps: true
    }`
    )
    .join(',');

  return `(() => { const D = DATOS.${datosKey};
  let activa = D.opciones[0];
  const fm = ${formato};
  const ch = new Chart(document.getElementById(${j(id)}), {
    type: 'line',
    data: { labels: D.labels, datasets: [${ds}] },
    options: {
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom' },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + fm(c.parsed.y) } } },
      scales: { x: { grid: { display: false } },
        y: { grid: { color: 'rgba(6,37,75,.07)' }, title: { display: ${!!eje}, text: ${j(eje)} }, ...${ejeValor} } }
    }
  });
  const cont = document.getElementById(${j(ctrlId)});
  const claves = ${j(series.map((s) => s.key))};
  const pintar = () => {
    [...cont.querySelectorAll('button')].forEach((b) => b.classList.toggle('on', b.dataset.op === activa));
  };
  D.opciones.forEach((op) => {
    const b = document.createElement('button');
    b.textContent = op; b.dataset.op = op;
    b.addEventListener('click', () => {
      activa = op;
      ch.data.datasets.forEach((d, i) => { d.data = D.series[activa][claves[i]]; });
      ch.update();
      pintar();
    });
    cont.appendChild(b);
  });
  pintar();
  })();`;
}

// Barras horizontales con selector (p.ej. año). A diferencia de lineaFiltrada,
// aqui tambien cambian las categorias del eje, no solo los valores.
// Forma esperada: DATOS[key] = { opciones: [...], series: { <opcion>: { labels, valores } } }
export function barrasFiltradas({ id, ctrlId, datosKey, label, eje = '', color: col = null, etiquetaCtrl = 'Año' }) {
  return `(() => { const D = DATOS.${datosKey};
  let activa = D.opciones[0];
  const ch = new Chart(document.getElementById(${j(id)}), {
    type: 'bar',
    data: { labels: D.series[activa].labels, datasets: [{
      label: ${j(label)}, data: D.series[activa].valores,
      backgroundColor: ${j(col || UNA.navyPrimary)}, borderRadius: 4, borderSkipped: false
    }] },
    plugins: [{ afterDatasetsDraw(ch2) {
      const ctx = ch2.ctx; ctx.save();
      ctx.font = '600 10px Poppins, system-ui, sans-serif';
      ctx.fillStyle = '${UNA.textMuted}'; ctx.textBaseline = 'middle';
      ch2.getDatasetMeta(0).data.forEach((el, i) => {
        const v = ch2.data.datasets[0].data[i];
        if (v === null || v === undefined) return;
        ctx.fillText(fmtC(v), el.x + 6, el.y);
      });
      ctx.restore();
    } }],
    options: {
      indexAxis: 'y',
      layout: { padding: { right: 54 } },
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + fmtC(c.parsed.x) } } },
      scales: {
        x: { grid: { display: true }, title: { display: ${!!eje}, text: ${j(eje)} }, ...ejeCompacto },
        y: { grid: { color: 'rgba(6,37,75,.07)' }, ticks: { font: { size: 10 }, autoSkip: false } }
      }
    }
  });
  const cont = document.getElementById(${j(ctrlId)});
  const pintar = () => {
    [...cont.querySelectorAll('button')].forEach((b) => b.classList.toggle('on', b.dataset.op === activa));
  };
  D.opciones.forEach((op) => {
    const b = document.createElement('button');
    b.textContent = op; b.dataset.op = op;
    b.addEventListener('click', () => {
      activa = op;
      ch.data.labels = D.series[activa].labels;
      ch.data.datasets[0].data = D.series[activa].valores;
      ch.update();
      pintar();
    });
    cont.appendChild(b);
  });
  pintar();
  })();`;
}

// Mapa de calor en HTML (no Chart.js): anios en filas, meses en columnas.
// El sufijo va vacio por defecto: con 12 columnas en una tarjeta a media
// pagina no cabe "+54.3%" sin recortarse. La unidad se indica en la
// descripcion de la tarjeta, no en cada celda.
export function heatmapHtml(matrizCompleta, { sufijo = '' } = {}) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  // Se omiten los años sin ningun dato: una fila entera de "n/d" no aporta.
  const matriz = matrizCompleta.filter((f) => f.valores.some((v) => v !== null && v !== undefined));
  if (!matriz.length) return '<div class="hintc">Sin datos suficientes para el periodo.</div>';
  const vals = matriz.flatMap((f) => f.valores.filter((v) => v !== null && v !== undefined));
  const maxAbs = Math.max(...vals.map((v) => Math.abs(v)), 1);
  const celda = (v) => {
    if (v === null || v === undefined) return `<td class="heat-cell empty">n/d</td>`;
    const int = Math.min(Math.abs(v) / maxAbs, 1);
    // Verde para variacion positiva, rojo para negativa (escala UNA).
    const base = v >= 0 ? [46, 139, 87] : [239, 68, 68];
    const bg = `rgba(${base[0]},${base[1]},${base[2]},${(0.12 + int * 0.75).toFixed(2)})`;
    const fg = int > 0.55 ? '#fff' : UNA.textDark;
    return `<td class="heat-cell" style="background:${bg};color:${fg}">${v >= 0 ? '+' : ''}${v.toFixed(1)}${sufijo}</td>`;
  };
  const filas = matriz
    .map((f) => `<tr><td class="yr">${f.anio}</td>${f.valores.map(celda).join('')}</tr>`)
    .join('');
  return `<div class="heat-wrap"><table class="heat-table">
    <thead><tr><th class="yr-col"></th>${meses.map((m) => `<th>${m}</th>`).join('')}</tr></thead>
    <tbody>${filas}</tbody></table></div>`;
}
