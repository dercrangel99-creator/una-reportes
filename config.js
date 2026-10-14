// Configuracion central del generador de reportes UNA.
// No contiene credenciales: solo apunta al backend ya existente.

export const BACKEND_URL = process.env.UNA_BACKEND_URL || 'http://localhost:4000';
export const UI_PORT = Number(process.env.UNA_REPORTES_PORT || 5173);

// Paleta de marca UNA (tomada de FrontendUNA/app/globals.css y de los
// tokens BRAND que usan los dashboards de market-intelligence).
export const UNA = {
  navyDeep: '#06254B',
  navyPrimary: '#03488D',
  accentYellow: '#F8D227',
  bgLight: '#F2F8FF',
  textDark: '#1C1C1C',
  textEditorial: '#3a4256',
  textMuted: '#5a6478',
  green: '#2e8b57',
  red: '#EF4444',
  amber: '#b85c00',
  cyan: '#0EA5E9',
  gold: '#C8A84B',
  line: '#DCE6F5',
  white: '#FFFFFF',
};

// Orden de colores para series de graficos.
export const SERIE_COLORS = [
  UNA.navyPrimary,
  UNA.accentYellow,
  UNA.cyan,
  UNA.green,
  UNA.gold,
  UNA.red,
  UNA.navyDeep,
  UNA.amber,
];

// ---- Design System v3 (DESIGN-una-v3.md) ----------------------------------
// Estructura (portada, sidebar, cabecera de la home) en el estilo oscuro "CME";
// contenido de datos en el claro de dashboards. Los valores salen tal cual del
// documento de diseño; ver las secciones citadas en cada grupo.
export const V3 = {
  // §2.1 Oscuro CME
  brandDark: '#030712',
  brandNavy: '#0B1528',
  brandSlate: '#1E293B',
  yellow: '#FDC300',
  yellowHover: '#fde047',
  cyan: '#0EA5E9',
  cyanHover: '#38bdf8',
  cyanText: '#0284c7',
  up: '#10B981',
  down: '#EF4444',
  glass: 'rgba(11,21,40,0.80)',
  textOnDark: '#e2e8f0',
  textOnDarkStrong: '#f1f5f9',
  textOnDark2: '#94a3b8',
  textOnDark3: '#64748b',
  hairlineDark: 'rgba(255,255,255,0.06)',
  hairlineDarkUi: 'rgba(255,255,255,0.10)',

  // §2.2 / §2.3 Claro editorial y dashboards de datos
  navyDeep: '#06254B',
  navyPrimary: '#03488D',
  yellowLight: '#F8D227',
  pageBg: '#F3F5F8',
  panel: '#FFFFFF',
  panelBorder: '#E2E8F0',
  panelTitle: '#1A2B4A',
  fieldLabel: '#6B7B8F',
  caption: '#9AA5B1',
  text: '#2d3748',
  text2: '#4a5568',
  textMuted: '#5a6478',
  textStrong: '#0f172a',
  hairline: 'rgba(6,37,75,0.08)',
  hairlineUi: 'rgba(6,37,75,0.18)',

  // §2.5 Estados sobre claro (fondo / texto)
  okBg: 'rgba(16,185,129,0.10)', okText: '#059669',
  errorBg: 'rgba(239,68,68,0.10)', errorText: '#dc2626',
  pendingBg: 'rgba(253,195,0,0.12)', pendingText: '#b45309',
  activeBg: 'rgba(14,165,233,0.10)', activeText: '#0369a1',

  // §3 Sombras (claro, tinte navy) y §6 movimiento
  shadowRest: '0 2px 12px rgba(6,37,75,0.06)',
  shadowHover: '0 14px 36px rgba(6,37,75,0.12)',
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',

  // §5.1 Radios
  radius: '2px',
  radiusPanel: '10px',
};

// §4.1 Tipografía: Playfair (títulos), Inter (interfaz), JetBrains Mono (cifras).
export const FUENTES = {
  url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap',
  display: "'Playfair Display', Georgia, serif",
  ui: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  num: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

// §2.4 Paleta de series para gráficos. El orden reproduce el que usa el
// backend (navy, gold, cyan, green, y la quinta serie sin color propio) y se
// validó con el validador de la guía dataviz contra el panel blanco: banda de
// luminosidad, croma, separación para daltonismo (ΔE ≥ 8 entre vecinos) y
// visión normal (ΔE ≥ 15). El navy de series es #1D5E9D (acento navy del
// sistema): #0A2240 y #03488D quedan fuera de la banda de luminosidad.
// El gris va al final y se reserva para "Otros".
export const SERIE_V3 = [
  '#1D5E9D', // navy
  '#C8A84B', // gold
  '#0EA5E9', // cyan
  '#1D9E75', // teal
  '#E07B2A', // naranja (exportaciones)
  '#8B5CF6', // violeta
  '#EF4444', // rojo
  '#94A3B8', // gris: "Otros"
];

// Colores semánticos que usa el modelo del backend, llevados a la paleta v3.
export const PALETA_V3 = {
  navy: SERIE_V3[0],
  gold: SERIE_V3[1],
  cyan: SERIE_V3[2],
  green: SERIE_V3[3],
  amber: SERIE_V3[4],
  red: SERIE_V3[6],
  gris: SERIE_V3[7],
};

// Mapa de calor: verde para variación positiva y rojo para negativa (§2.5).
export const HEAT_V3 = {
  sube: [4, 120, 87],
  baja: [220, 38, 38],
  vacio: '#EEF2F7',
  vacioTexto: '#B6C2D2',
  texto: '#0f172a',
};

export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
