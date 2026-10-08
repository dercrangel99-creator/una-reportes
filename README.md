# Generador de reportes UNA

Genera los reportes HTML de **huevo** y **pollo** consultando en vivo la base de
datos institucional a través del backend existente (`powerbiBackend`).

El resultado es un archivo HTML autocontenido: lleva los datos embebidos y solo
carga Chart.js desde CDN, así que se puede abrir, enviar por correo o imprimir
sin necesidad de que el backend siga encendido.

## Requisitos

- Node.js 18 o superior (usa `fetch` nativo).
- El backend `powerbiBackend` corriendo (por defecto en `http://localhost:4000`).

**No requiere instalación de paquetes**: el proyecto no tiene dependencias
externas, así que no hay `node_modules` ni archivo de lock. Por eso no entra en
conflicto con el gestor que usan el backend y el frontend (pnpm): los comandos
se pueden correr con `node`, `npm run` o `pnpm run` indistintamente.

## Uso

### Opción 1 — interfaz con botón

```bash
node server.js
```

Abre `http://localhost:5173`. Cada reporte tiene un botón "Generar con datos
actuales": al hacer clic se consulta el backend, se arma el HTML y queda listo
para verlo. La página indica si el backend está disponible y cuándo se generó
cada reporte por última vez.

### Opción 2 — línea de comandos

```bash
node generate.js            # genera huevo y pollo
node generate.js huevo      # solo huevo
node generate.js pollo      # solo pollo
```

Los archivos quedan en `out/reporte_huevo.html` y `out/reporte_pollo.html`.

### Validar el resultado

```bash
node scripts/validar.mjs
```

Ejecuta el JavaScript embebido de cada reporte con un stub de Chart.js y del DOM.
Detecta gráficos sin datos, canvas huérfanos y valores rotos que de otro modo
solo se verían al abrir el archivo en el navegador.

## Configuración

Por variables de entorno (ambas opcionales):

| Variable | Por defecto | Para qué sirve |
|---|---|---|
| `UNA_BACKEND_URL` | `http://localhost:4000` | URL del backend |
| `UNA_REPORTES_PORT` | `5173` | Puerto de la interfaz |

## Relación con el backend

Todo el contenido llega de un único endpoint:

```
GET /api/reportes/avicola                  ambos reportes
GET /api/reportes/avicola?producto=pollo   solo uno (pollo | huevo)
GET /api/reportes/avicola?refrescar=1      ignora la caché del backend
```

El backend resuelve las consultas y **calcula los indicadores derivados**
(promedios y sumas móviles, variación interanual, correlación con rezago,
conversión a cajas, supresión de precios atípicos). Así, cualquier otro sistema
que consuma el mismo endpoint obtiene exactamente las mismas cifras sin
reimplementar la matemática.

Este proyecto solo se encarga de la presentación: paleta, tipos de gráfico y
maquetación. El modelo llega en unos segundos, de modo que generar los dos
reportes es casi inmediato.

## Estructura

```
config.js              Backend, puerto y paleta de marca UNA
generate.js            Generador por línea de comandos
server.js              Interfaz con el botón de generación
src/
  api.js               Cliente del endpoint de reportes
  render.js            Convierte el modelo del backend en HTML
  charts.js            Constructores de gráficos Chart.js y mapas de calor
  html.js              Diseño: CSS, cabecera, tarjetas, secciones
  metrics.js           Formato de cifras
scripts/validar.mjs    Validador de los reportes generados
out/                   Reportes generados
```

Para agregar una sección nueva se edita `reportesService.js` en el backend: ahí
se define la sección con sus gráficos y sus datos. El renderizador la dibuja
sola, siempre que el gráfico use uno de los tipos que entiende (`linea`,
`barras`, `combo`, `lineaFiltrada`, `barrasFiltradas`, más mapas de calor y
tablas).

## Diseño

Replica el layout y la tipografía (Poppins) de los reportes HTML originales de
la UNA, pero con la paleta de marca del frontend: azul marino `#06254B`,
azul primario `#03488D` y amarillo `#F8D227`.

## Brechas de datos conocidas

Hay secciones de los reportes originales que **no** se pueden reproducir porque
el dato no existe todavía en la base:

- **Movilización de huevo en cajas** — no hay tabla equivalente.
- **Pollitos alojados** (pollo) — proviene del modelo interno de estimación.
- **Sacrificio y producción de carne mensual** — en la base solo existe el
  equivalente anual; el reporte lo muestra con esa granularidad y lo advierte.
- **Destino del huevo importado por estado** — proviene de Veritrade, una fuente
  externa que no está integrada al backend.
