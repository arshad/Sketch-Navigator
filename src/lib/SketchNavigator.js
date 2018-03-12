import WebUI from 'sketch-module-web-view';
import { isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote'
import SketchConfig from './SketchConfig';
import SketchDocumentTree from './SketchDocumentTree';

// Default keys for NSUserDefaults.
const selectedArtboardKey = "SketchNavigatorSelectedArtboardKey";
const previousArtboardKey = "SketchNavigatorPreviousArtboardKey";
const webuiIdentifier = 'sketch-navigator.ui';

module.exports = {
  navigate: (context) => {
    const document = context.document;
    const tree = SketchDocumentTree.getTreeFromDocument(document);
    const comboBoxValues = SketchDocumentTree.buildComboBoxValuesFromTree(tree);

    const webUI = new WebUI(context, require('../../resources/webview.html'), {
      identifier: webuiIdentifier,
      width: 500,
      height: 80,
      blurredBackground: true,
      onlyShowCloseButton: true,
      hideCloseButton: true,
      hideTitleBar: true,
      shouldKeepAround: true,
      frameLoadDelegate: {
        'webView:didFinishLoadForFrame:'(webView, webFrame) {
          const data = JSON.stringify({
            options: comboBoxValues,
          });

          if (isWebviewPresent(webuiIdentifier)) {
            sendToWebview(webuiIdentifier, `showNavigatorWithOptions(${data})`);
          }
        }
      },
      handlers: {
        navigateToArtboardWithIndex: function (targetIndex) {

          // Get the default index.
          let defaultSelectedIndex = SketchConfig.get(selectedArtboardKey);
          if (defaultSelectedIndex === null || defaultSelectedIndex > comboBoxValues.length - 1) {
            defaultSelectedIndex = 1
          }

          // Get the previous index.
          let selectedIndex = SketchConfig.get(previousArtboardKey)
          if (selectedIndex === null || selectedIndex > comboBoxValues.length - 1) {
            selectedIndex = 1
          }

          if (targetIndex !== null) {
            selectedIndex = targetIndex;
          }

          if (selectedIndex >= 0) {
            const flattenedTree = SketchDocumentTree.flattenTree(tree);
            const targetValue = comboBoxValues[selectedIndex];
            const target = flattenedTree[targetValue];

            // Save to defaults.
            SketchConfig.set(selectedArtboardKey, selectedIndex);
            SketchConfig.set(previousArtboardKey, defaultSelectedIndex);

            // Navigate to target.
            SketchDocumentTree.navigateToArtboardOnPageInDocument(target["artboard"], target["page"], document, true);

            // Close the panel.
            webUI.panel.close();
          }
        }
      }
    });
  }
};
