export function createSidebarActions({ editorState, render }) {
  function getCollapsedPageIds() {
    return Array.isArray(editorState.ui?.collapsedPageIds)
      ? editorState.ui.collapsedPageIds
      : [];
  }

  return {
    toggleSidebarCollapsed() {
      editorState.ui = {
        ...editorState.ui,
        sidebarCollapsed: editorState.ui?.sidebarCollapsed !== true,
      };
      render();
    },

    togglePageTreeNode(pageId) {
      const collapsedPageIds = new Set(getCollapsedPageIds());

      if (collapsedPageIds.has(pageId)) {
        collapsedPageIds.delete(pageId);
      } else {
        collapsedPageIds.add(pageId);
      }

      editorState.ui = {
        ...editorState.ui,
        collapsedPageIds: [...collapsedPageIds],
      };
      render();
    },
  };
}
