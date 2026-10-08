// Cliente del endpoint de reportes del backend (powerbiBackend).
// Todo el modelo llega en una sola peticion: el backend ya resolvio las
// consultas y los indicadores derivados.

import { BACKEND_URL } from '../config.js';

const TIMEOUT_MS = 300000;

export async function obtenerModelo({ producto = 'todos', refrescar = true } = {}) {
  const qs = new URLSearchParams({ producto, ...(refrescar ? { refrescar: '1' } : {}) });
  const url = `${BACKEND_URL}/api/reportes/avicola?${qs}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    const json = await res.json();
    if (!json?.success) throw new Error(json?.error ?? 'El backend respondió sin datos');
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}

// El backend responde 503 en /health cuando algun subservicio esta degradado,
// aunque los endpoints de datos sigan funcionando. Basta con que conteste.
export async function healthCheck() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    await fetch(`${BACKEND_URL}/api/health`, { signal: ctrl.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
