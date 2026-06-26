# Mini RPG Printer

Editor visual estilo OneNote/Figma para preparar hojas de bolsillo imprimibles.

## Ejecutar

```bash
npm install
npm run dev
```

## Estado actual

- Editor con pares de hojas lado a lado.
- Cada hoja mide `85mm x 147.5mm`.
- Cada par nuevo se agrega debajo del anterior.
- Grilla gris clara de `5mm x 5mm`, originada en la esquina superior izquierda de cada hoja.
- Toggle para mostrar u ocultar la grilla.
- Bloque inicial disponible: bloque de texto centrado.
- Los bloques se mueven y redimensionan con snap obligatorio de `5mm`.
- Doble click sobre un bloque para editar texto.
- `Delete`, `Supr` o botón `Borrar bloque` para eliminar el bloque seleccionado.
- Selector de fuente para el bloque seleccionado.

## Controles

- `Agregar bloque de texto`: crea un bloque en la primera hoja.
- `Agregar par de hojas`: agrega dos hojas nuevas debajo.
- Click sobre bloque: seleccionar.
- Arrastrar bloque: moverlo por la hoja.
- Tirador inferior derecho: redimensionar.
- Doble click: editar texto.
- `Ctrl + Enter`: terminar edición.
- `Escape`: salir de edición.
- `Delete` / `Supr`: borrar bloque seleccionado.

## Próximos pasos razonables

1. Permitir elegir en qué hoja se crea el nuevo bloque.
2. Persistir el documento en `localStorage`.
3. Agregar exportación/impresión A4.
4. Agregar más elementos: línea, caja, imagen, tabla pequeña, checkbox, título.
5. Agregar zoom sin perder la escala física en milímetros.
