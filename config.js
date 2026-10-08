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

export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
