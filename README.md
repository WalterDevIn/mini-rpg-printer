# Mini RPG Printer

Editor visual para crear documentos imprimibles en PDF. La app está pensada como una versión pequeña de un editor tipo Figma/OneNote: canvas desplazable, páginas físicas en milímetros, bloques editables y comandos de edición.

## Ejecutar

```bash
npm install
npm run dev
```

## Propósito

La aplicación edita documentos diseñados para impresión. El documento interno usa unidades físicas (`mm`) para que el layout que se ve en pantalla pueda exportarse después a PDF o imprimirse sin sorpresas de escala.

## Estado actual

- Editor con pares de hojas lado a lado.
- Cada hoja mide `105mm x 147.5mm`.
- Cada par nuevo se agrega debajo del anterior.
- Grilla gris clara de `5mm x 5mm`, originada en la esquina superior izquierda de cada hoja.
- Toolbar compacta con iconos de Font Awesome.
- Toggle para mostrar u ocultar la grilla.
- Bloque inicial disponible: bloque de texto centrado.
- Los bloques se mueven y redimensionan con snap obligatorio de `5mm`.
- Los bloques pueden arrastrarse entre páginas.
- Mientras se arrastra, el bloque se eleva y se tuerce levemente; al soltarlo hace una pequeña animación de caída.
- Segundo click sobre un bloque ya seleccionado para editar texto.
- `Enter` confirma la edición.
- Click fuera u otro bloque cierra la edición actual.
- Click derecho sobre un bloque abre el menú de propiedades.
- `Delete`, `Supr`, `Backspace` o botón de papelera eliminan el bloque seleccionado.

## Arquitectura

```text
src/
  main.js                       # Entry point mínimo
  app/
    createEditorApp.js           # Composition root de la aplicación
  document/
    printSpec.js                 # Tamaño físico, grilla e intención de impresión
    documentFactory.js            # Crea documentos, páginas, spreads y bloques
    documentQueries.js            # Búsqueda dentro del documento
    documentCommands.js           # Mutaciones del documento imprimible
  blocks/
    blockTypes.js                # Tipos de bloque soportados
    blockRegistry.js             # Registro extensible de bloques
    textBlockDefinition.js        # Definición del bloque de texto
  editor/
    editorState.js               # Estado de editor: documento, viewport, selección, interacción
    editorController.js           # Acciones de aplicación; traduce UI a comandos
    editorSelectors.js            # Selectores derivados del estado
    blockInteraction.js           # Fachada pública de interacción usada por la vista
    interaction/
      blockDragSession.js         # Sesión de drag: ghost, long press, drop y commit final
      blockResizeSession.js       # Sesión de resize sin re-render continuo
      dragGhost.js                # Ghost visual usado durante drag
      frameMath.js                # Cálculo de frames en mm y px
      interactionConstants.js     # Umbrales y duraciones de interacción
      pageHitTesting.js           # Detección de página bajo el puntero
    installEditorEvents.js        # Atajos y eventos globales
    textEditing.js                # Helpers DOM de edición textual
  view/
    renderEditor.js              # Vista raíz
    renderToolbar.js             # Toolbar
    renderCanvas.js              # Canvas, spreads y páginas
    renderBlock.js               # Render de bloques tipados
    renderContextMenu.js          # Menú contextual de propiedades
  shared/
    createId.js                  # IDs
    dom.js                       # Helpers DOM
    geometry.js                  # Conversión px/mm, snap y constraints
```

## Criterio de capas

`document/` no sabe nada del DOM. Define el documento imprimible y sus comandos.

`blocks/` define tipos de bloque. Para agregar un bloque nuevo, se agrega su definición y luego su render.

`editor/` maneja selección, herramienta activa, edición, drag, resize y comandos de usuario.

`editor/interaction/` contiene interacciones pointer específicas. No define el documento, sólo calcula y confirma operaciones mediante el controller.

`view/` sólo renderiza y captura eventos.

`shared/` contiene utilidades sin dependencia del dominio.

## Agregar un nuevo tipo de bloque

1. Crear una definición en `src/blocks/` con `type`, `label`, `iconClass`, `defaultFrame` y `defaultProps`.
2. Registrar el tipo en `blockRegistry.js`.
3. Agregar su render en `renderBlock.js`.
4. Agregar un botón o herramienta en `renderToolbar.js`.

## Próximos pasos razonables

1. Persistir el documento en `localStorage`.
2. Agregar exportación/impresión A4 o PDF.
3. Separar herramientas: selección, texto, imagen, caja, línea.
4. Agregar inspector lateral de propiedades.
5. Agregar zoom sin perder la escala física en milímetros.
