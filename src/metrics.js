// Calculos derivados que los reportes HTML muestran y que el backend no
// entrega precalculados: sumas moviles, promedios moviles, variacion
// interanual, correlacion con rezago y formateo de cifras.

export const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
};

// Serie mensual ordenada -> suma movil de N meses.
export function sumaMovil(serie, ventana = 12) {
  const out = [];
  for (let i = 0; i < serie.length; i++) {
    if (i + 1 < ventana) { out.push(null); continue; }
    let acc = 0, faltantes = 0;
    for (let j = i - ventana + 1; j <= i; j++) {
      const v = num(serie[j]?.valor);
      if (v === null) faltantes++; else acc += v;
    }
    out.push(faltantes > 2 ? null : acc);
  }
  return out;
}

export function promedioMovil(serie, ventana = 12) {
  const out = [];
  for (let i = 0; i < serie.length; i++) {
    if (i + 1 < ventana) { out.push(null); continue; }
    const vals = [];
    for (let j = i - ventana + 1; j <= i; j++) {
      const v = num(serie[j]?.valor);
      if (v !== null) vals.push(v);
    }
    out.push(vals.length >= ventana - 2 ? vals.reduce((a, b) => a + b, 0) / vals.length : null);
  }
  return out;
}

// Variacion contra el mismo mes del anio anterior (12 posiciones atras).
export function variacionInteranual(serie) {
  return serie.map((p, i) => {
    if (i < 12) return null;
    const act = num(p.valor), prev = num(serie[i - 12]?.valor);
    if (act === null || prev === null || prev === 0) return null;
    return ((act - prev) / Math.abs(prev)) * 100;
  });
}

// El precio implicito (valor / volumen) se vuelve ruido cuando el mes tuvo un
// volumen insignificante: un embarque de 60 kg con sus costos fijos puede dar
// $24/kg donde el mercado opera a $2. Se anulan esos puntos para que la serie
// siga siendo legible, tomando como referencia la mediana del propio origen.
export function suprimirPreciosAtipicos(precios, volumenes, { fraccionMinima = 0.02, pisoAbsoluto = 0.5 } = {}) {
  const conDato = volumenes.filter((v) => v !== null && v > 0).sort((a, b) => a - b);
  if (!conDato.length) return precios;
  const mediana = conDato[Math.floor(conDato.length / 2)];
  const umbral = Math.max(mediana * fraccionMinima, pisoAbsoluto);
  return precios.map((p, i) => {
    const v = volumenes[i];
    if (v === null || v === undefined) return p;
    return v < umbral ? null : p;
  });
}

export function variacion(actual, previo) {
  const a = num(actual), p = num(previo);
  if (a === null || p === null || p === 0) return null;
  return ((a - p) / Math.abs(p)) * 100;
}

// Correlacion de Pearson entre dos series alineadas, con rezago en meses:
// y[i] se compara contra x[i - rezago].
export function correlacionConRezago(x, y, rezago = 0) {
  const pares = [];
  for (let i = rezago; i < y.length; i++) {
    const vx = num(x[i - rezago]), vy = num(y[i]);
    if (vx !== null && vy !== null) pares.push([vx, vy]);
  }
  if (pares.length < 6) return null;
  const n = pares.length;
  const mx = pares.reduce((a, p) => a + p[0], 0) / n;
  const my = pares.reduce((a, p) => a + p[1], 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const [a, b] of pares) {
    sxy += (a - mx) * (b - my);
    sxx += (a - mx) ** 2;
    syy += (b - my) ** 2;
  }
  if (sxx === 0 || syy === 0) return null;
  return { r: sxy / Math.sqrt(sxx * syy), n };
}

// Busca el rezago (0..maxRezago) con mayor correlacion absoluta.
export function mejorRezago(x, y, maxRezago = 12) {
  const resultados = [];
  for (let k = 0; k <= maxRezago; k++) {
    const c = correlacionConRezago(x, y, k);
    if (c) resultados.push({ rezago: k, ...c });
  }
  if (!resultados.length) return { resultados: [], mejor: null };
  const mejor = resultados.reduce((a, b) => (Math.abs(b.r) > Math.abs(a.r) ? b : a));
  return { resultados, mejor };
}

// ---- Formateo -------------------------------------------------------------

export const fmtNum = (v, dec = 0) =>
  v === null || v === undefined || !Number.isFinite(Number(v))
    ? '—'
    : Number(v).toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const fmtMoneda = (v, dec = 2) => (v === null || v === undefined ? '—' : `$${fmtNum(v, dec)}`);

export const fmtCompacto = (v) => {
  const n = num(v);
  if (n === null) return '—';
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)} MM`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)} M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)} mil`;
  return fmtNum(n, 0);
};

export const fmtPct = (v, dec = 1) =>
  v === null || v === undefined || !Number.isFinite(Number(v)) ? '—' : `${Number(v).toFixed(dec)}%`;

// Texto de delta listo para la tarjeta KPI.
export function delta(pct, { sufijo = '' } = {}) {
  if (pct === null || pct === undefined || !Number.isFinite(Number(pct))) {
    return { texto: '—', clase: '' };
  }
  const p = Number(pct);
  const flecha = p > 0 ? '▲' : p < 0 ? '▼' : '—';
  return {
    texto: `${flecha} ${Math.abs(p).toFixed(1)}%${sufijo}`,
    clase: p > 0 ? 'up' : p < 0 ? 'dn' : '',
  };
}
