# Mini RPG Printer

Editor visual estilo OneNote/Figma para preparar hojas de bolsillo imprimibles.

## Ejecutar

```bash
npm install
npm run dev
```

## Estado actual

- Editor con pares de hojas lado a lado.
- Cada hoja mide `105mm x 147.5mm`.
- Cada par nuevo se agrega debajo del anterior.
- Grilla gris clara de `5mm x 5mm`, originada en la esquina superior izquierda de cada hoja.
- Toolbar compacta con iconos de Font Awesome.
- Toggle para mostrar u ocultar la grilla.
- Bloque inicial disponible: bloque de texto centrado.
- Los bloques se mueven y redimensionan con snap obligatorio de `5mm`.
- Segundo click sobre un bloque ya seleccionado para editar texto.
- `Enter` confirma la edición.
- Click fuera u otro bloque cierra la edición actual.
- Click derecho sobre un bloque abre el menú de fuente.
- `Delete`, `Supr`, `Backspace` o botón de papelera eliminan el bloque seleccionado.

## Controles

- Icono `A`: crea un bloque de texto en la primera hoja.
- Icono de hojas: agrega dos hojas nuevas debajo.
- Icono de papelera: borra el bloque seleccionado.
- Icono de grilla: activa o desactiva la grilla.
- Click sobre bloque: seleccionar.
- Segundo click sobre el mismo bloque: editar texto.
- Arrastrar bloque: moverlo por la hoja.
- Tirador inferior derecho: redimensionar.
- `Enter`: terminar edición.
- `Escape`: salir de edición o cerrar menú contextual.
- Click derecho sobre bloque: cambiar fuente.

## Estructura

- `src/main.js`: entry point mínimo.
- `src/app/boot.js`: arranque.
- `src/app/render.js`: render global y eventos globales.
- `src/core/`: constantes, geometría, estado y modelo del documento.
- `src/ui/`: componentes de toolbar, hojas, bloques, menú contextual y helpers DOM.

## Próximos pasos razonables

1. Permitir elegir en qué hoja se crea el nuevo bloque.
2. Persistir el documento en `localStorage`.
3. Agregar exportación/impresión A4.
4. Agregar más elementos: línea, caja, imagen, tabla pequeña, checkbox, título.
5. Agregar zoom sin perder la escala física en milímetros.
