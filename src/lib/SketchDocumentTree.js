module.exports = {

  // Builds a tree of pages and artboards from the document.
  getTreeFromDocument: (document) => {
    const pages = document.pages();

    let tree = {};
    for (let i = 0; i < pages.count(); i++) {
      const currentPage = pages.objectAtIndex(i);
      tree[currentPage.name()] = {
        page: currentPage,
        artboards: currentPage.artboards()
      }
    }

    return tree
  },

  // Helper to flatten a tree using "page: artboard" as index.
  flattenTree: (tree) => {
    let flattenedTree = {};

    for (let name in tree) {
      // Get the page.
      const page = tree[name]['page'];

      // Add artboards.
      const artboards = tree[name]['artboards'];
      const loop = artboards.objectEnumerator();
      while (artboard = loop.nextObject()) {
        flattenedTree[name + ": " + artboard.name()] = {
          page: page,
          artboard: artboard
        }
      }
    }

    return flattenedTree;
  },

  // Navigates to an artboard.
  navigateToArtboardOnPageInDocument: (artboard, page, document, zoom) => {
    let view = document.contentDrawView();
    document.setCurrentPage(page);

    if (zoom) {
      // Create a rect from artboard dimensions to zoom to.
      const padding = 0.050;
      let rect = artboard.rect();
      rect.origin.x -= rect.size.width * padding;
      rect.origin.y -= rect.size.height * padding;
      rect.size.width *= 1 + padding * 2;
      rect.size.height *= 1 + padding * 2;
      view.zoomToFitRect(rect);
    }
  },

  // Builds a comboBox friendly array from tree.
  buildComboBoxValuesFromTree: (tree) => {
    let values = [];

    for (let name in tree) {
      // Add artboards.
      let artboards = tree[name]['artboards']
      let loop = artboards.reverseObjectEnumerator();
      while (artboard = loop.nextObject()) {
        values.push(name + ": " + artboard.name())
      }
    }

    return values
  },
};
