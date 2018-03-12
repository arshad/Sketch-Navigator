import pluginCall from 'sketch-module-web-view/client'

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

const $artboardSelector = document.getElementById('artboard-selector');

$artboardSelector.addEventListener('change', () => {
  pluginCall('navigateToArtboardWithIndex', $artboardSelector.value);
});

// called from the plugin
window.showNavigatorWithOptions = function ({options}) {
  options.forEach((option, value) => {
    const $option = document.createElement('option');
    $option.value = value;
    $option.text = option;
    $artboardSelector.add($option);
  });
};
