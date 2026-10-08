# Cómo consumir el endpoint de reportes

Guía para quien vaya a construir un frontend que muestre los reportes avícolas
de la UNA (pollo y huevo) sin reimplementar los cálculos.

El backend entrega el reporte completo ya resuelto: series, indicadores y
textos. El frontend solo decide **cómo se ve**.

---

## 1. La petición

```
GET  {BACKEND_URL}/api/reportes/avicola
```

| Parámetro | Valores | Por defecto | Para qué |
|---|---|---|---|
| `producto` | `pollo`, `huevo`, `todos` | `todos` | Qué reporte traer |
| `refrescar` | `1` | — | Ignora la caché del servidor |

El servidor cachea el resultado 30 minutos. Una petición en frío tarda unos
4 segundos; con caché es inmediata. Las fuentes se actualizan como mucho una
vez al día, así que lo normal es no pasar `refrescar`.

```js
const res  = await fetch(`${BACKEND_URL}/api/reportes/avicola?producto=pollo`);
const { success, data } = await res.json();
const modelo = data.reportes.pollo;
```

Respuesta:

```jsonc
{
  "success": true,
  "data": {
    "generadoEn": "2026-10-08T15:00:00.000Z",
    "desdeCache": false,
    "parametros": { "producto": "todos" },
    "reportes": { "huevo": { /* modelo */ }, "pollo": { /* modelo */ } }
  }
}
```

---

## 2. El modelo de un reporte

```jsonc
{
  "meta": {
    "titulo": "UNA · Pollo — Reporte Analítico",
    "encabezadoLineas": ["Pollo: precio al productor,", "oferta y comercio exterior"],
    "datosA": "julio de 2026"
  },
  "lectura": "**Lectura ejecutiva.** El pollo vivo en andén se ubicó en **$28.50/kg** …",
  "kpis":      [ /* ver §3 */ ],
  "secciones": [ /* ver §4 */ ]
}
```

`lectura` y los textos de `lecturas` traen el énfasis marcado con
`**dobles asteriscos**`. Se convierten a negritas **después** de escapar el
texto, nunca antes:

```js
const enfasis = (t) => escaparHTML(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
```

---

## 3. Indicadores (`kpis`)

```jsonc
{
  "id": "Granja",
  "label": "Pollo en granja · Jul 2026",
  "valor": 27.28,
  "formato": "moneda",            // moneda | compacto | numero
  "unidad": "/kg",
  "delta": { "pct": -12.5, "direccion": "baja" },   // o null
  "deltaNota": "vs. mismo mes año anterior",
  "nota": "Precio pagado al productor",
  "secundario": true,             // opcional
  "seccion": "sanidad"            // opcional
}
```

- `formato` indica cómo presentar el número: `moneda` → `$27.28`,
  `compacto` → `1.53 M`, `numero` → `81,640`.
- `direccion` (`sube` / `baja` / `igual`) es la que decide el color; no te
  fíes del signo de `pct` para eso, porque en algún indicador bajar es bueno.
- **`secundario: true`** son cifras que existen para quien las necesite pero
  que el reporte oficial no muestra como tarjeta (aparecen dentro de la
  lectura ejecutiva). Si quieres replicar el diseño actual, **fíltralas**.
- **`seccion: "sanidad"`** indica que esa tarjeta pertenece a una sección y no
  a la cabecera.

```js
const cabecera = modelo.kpis.filter((k) => !k.secundario && !k.seccion);
const deSeccion = (id) => modelo.kpis.filter((k) => k.seccion === id);
```

---

## 4. Secciones

```jsonc
{
  "id": "comercio",
  "navLabel": "Comercio exterior",     // texto corto para el menú
  "numero": "Sección 06",
  "titulo": "Comercio exterior",
  "graficos": [ /* ver §5 */ ],
  "heatmaps": [ /* ver §6 */ ],
  "tablas":   [ /* ver §7 */ ],
  "lecturas": ["**Cómo leerlo.** …"],
  "avisos":   [{ "titulo": "Sobre la exportación", "texto": "…" }],
  "correlacion": { "rezagoMeses": 5, "r": -0.22, "observaciones": 122 }
}
```

Las cuatro listas de contenido son opcionales: recórrelas con `?? []`.

---

## 5. Gráficos

Todos comparten estos campos: `id`, `tipo`, `titulo`, `descripcion`, `fuente`,
y opcionalmente `alto` (`tall` | `short`), `mitad` (ocupa media columna),
`moneda`, `compacto`, `eje`.

### `linea`

```jsonc
{
  "tipo": "linea", "eje": "Pesos por kilogramo", "moneda": true,
  "labels": ["Ene 13", "Feb 13", …],
  "series": [
    { "key": "precio", "label": "Precio al productor", "color": "navy",
      "datos": [19.87, 21.37, …] },
    { "key": "pm12", "label": "Promedio móvil 12 meses", "color": "gold",
      "dash": [6, 4], "datos": [null, null, …] }
  ]
}
```

`null` significa que no hay dato en ese punto; dibuja el hueco, no lo
interpoles ni lo cuentes como cero.

### `barras`

Igual que `linea`, más `horizontal`, `apilado` y `etiquetas` (escribir el valor
al final de cada barra).

### `combo`

Barras y línea en ejes distintos. La línea debe dibujarse **encima** de las
barras o se pierde detrás de ellas.

```jsonc
{
  "tipo": "combo", "ejeIzq": "Toneladas", "ejeDer": "USD/kg",
  "labels": […],
  "barras": [{ "key": "imp", "label": "Importación (t)", "color": "navy", "datos": [...] }],
  "lineas": [{ "key": "precio", "label": "Precio implícito (USD/kg)", "color": "gold",
               "datos": [...], "ejeIzq": false }]
}
```

Si `ejeIzq: true` esa línea usa el eje izquierdo; entonces **no dibujes el eje
derecho**, porque sin datos se renderiza con una escala 0–1 sin sentido.

### `lineaFiltrada` y `barrasFiltradas`

Llevan un selector. El frontend pinta un botón por opción y cambia los datos
del gráfico al pulsarlo.

```jsonc
// lineaFiltrada: cambian los valores, las categorías no
{
  "tipo": "lineaFiltrada", "ctrlId": "ctrlDetVolumen", "etiquetaCtrl": "Corte",
  "labels": ["Ene 22", …],
  "opciones": ["Pierna y Muslo", "Pechuga Deshuesada", …],
  "definicionSeries": [{ "key": "Estados Unidos", "label": "Estados Unidos", "color": "navy" }, …],
  "series": { "Pierna y Muslo": { "Estados Unidos": [...], "Brasil": [...] }, … }
}

// barrasFiltradas: cambian también las categorías del eje
{
  "tipo": "barrasFiltradas", "ctrlId": "ctrlPais", "etiquetaCtrl": "Año",
  "label": "Volumen importado (t)",
  "opciones": ["2026", "2025", …],
  "series": { "2026": { "labels": ["Estados Unidos", …], "valores": [493604, …] }, … }
}
```

Una serie puede venir vacía para una opción concreta y **no es un error**:
significa que esa combinación no existe en la fuente. Chile, por ejemplo, no
exporta Pierna y Muslo a México.

> **Ojo con las claves.** `key` puede traer espacios y acentos
> (`"Estados Unidos"`, `"Mercado Público"`). Accede siempre con corchetes
> (`D[key]`), nunca con notación de punto.

---

## 6. Mapas de calor (`heatmaps`)

```jsonc
{ "id": "heatGranja", "titulo": "Pollo en granja", "mitad": true,
  "matriz": [{ "anio": 2022, "valores": [null, 6.9, -0.1, …] }] }
```

Doce valores por fila (enero a diciembre), en porcentaje. Los años sin ningún
dato ya vienen descartados. Para que varios mapas se vean iguales conviene
repartir las doce columnas por igual (`table-layout: fixed`) y no escribir el
símbolo `%` en cada celda: no cabe y la unidad ya va en la descripción.

---

## 7. Tablas (`tablas`)

```jsonc
{
  "titulo": "Focos más recientes · últimos 30 días",
  "columnas": [ { "clave": "inicio", "label": "Inicio" },
                { "clave": "casos",  "label": "Casos", "numero": true } ],
  "filas": [ { "inicio": "2026-09-26", "casos": 25, … } ]
}
```

`numero: true` alinea a la derecha y da formato de miles. Un `null` se muestra
como guion: significa que la fuente aún no reporta esa cantidad.

---

## 8. Colores

El backend no impone paleta: nombra los colores por intención y cada frontend
los resuelve con la suya.

| Nombre | Se usa para |
|---|---|
| `navy` | Serie principal |
| `gold` | Serie secundaria, normalmente la línea de un combo |
| `cyan` | Tercera serie |
| `green` | Exportación, valores favorables |
| `red` | Muertes, pérdidas |
| `amber` | Contraste frente a `navy` |
| `gris` | Agregado "otros" |

Si una serie no trae `color`, asígnale uno de tu paleta por orden de aparición.
Los colores de marca de la UNA son `#06254B` (azul marino), `#03488D` (azul
primario) y `#F8D227` (amarillo).

---

## 9. Qué calcula el backend (y no debes repetir)

Todo esto llega resuelto. Si lo recalculas, te arriesgas a publicar cifras
distintas a las del reporte oficial:

- Promedios y sumas móviles de 12 meses, alineadas al último dato disponible.
- Variación interanual y las variaciones de cada indicador.
- Correlación de Pearson con rezago, calculada sobre **variaciones anuales** y
  no sobre niveles: ambas series crecen con la inflación, y correlacionar
  niveles produce una asociación espuria.
- Conversión de huevo fértil a cajas (360 huevos × 60 g = 21.6 kg por caja).
- Supresión del precio implícito en los meses de volumen marginal, donde los
  costos fijos del embarque disparan el valor por kilogramo.
- Las matrices de los mapas de calor.

---

## 10. Criterios de los datos

Decisiones tomadas en el backend que conviene conocer al leer las cifras:

- **Importación de pollo**: suma toda la carne, **incluida la CMD** (casi un
  tercio del volumen). Se excluyen las aves vivas, que son material genético.
- **Detalle por corte**: ahí sí quedan fuera la CMD y las aves vivas, porque no
  son comparables con los cortes de consumo.
- **Exportación de pollo**: es reexportación de producto elaborado con materia
  prima importada, no excedente nacional. Equivale al 0.3 % de la importación.
- **Huevo**: solo huevo de gallina. Se excluye el huevo fértil de pavo y unas
  partidas de carne mal clasificadas bajo la misma categoría. No se publica el
  total de la categoría porque mezcla presentaciones no comparables.
- **Sanidad**: el continente americano se delimita por la longitud del foco
  (170° O a 30° O). Las cantidades son por foco, no por evento del país.
- **Series de aves**: un `0` en el origen significa "mes sin capturar", no cero
  ventas; ya viene convertido a `null` y la cola sin datos viene recortada.
- **Precios de pollo**: las presentaciones se renombraron. `pollo_mercado_una`
  es hoy **Rosticero seco** y `pollo_rosticero_una` es **Rosticero comercial**.

---

## 11. Implementación de referencia

Este mismo repositorio consume el endpoint y genera los reportes en HTML:

| Archivo | Qué hace |
|---|---|
| `src/api.js` | La petición |
| `src/render.js` | Traduce el modelo a HTML; aquí está el `switch` por tipo de gráfico |
| `src/charts.js` | Construye los gráficos (Chart.js) y los mapas de calor |
| `src/html.js` | Maquetación: CSS, cabecera, tarjetas, secciones |
| `scripts/validar.mjs` | Ejecuta el JS del reporte con un Chart.js simulado y avisa si un gráfico se queda sin datos o un filtro se rompe |

Para agregar una sección nueva se edita `reportesService.js` **en el backend**:
se declara la sección con sus gráficos y sus datos, y el renderizador la dibuja
sola mientras use uno de los tipos de §5.
