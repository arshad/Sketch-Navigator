let pluginIdentifier = 'io.arshad.sketch.sketch-navigator';
let defaults = NSUserDefaults.alloc().initWithSuiteName(pluginIdentifier);

module.exports = {
  /**
   * Sets the value of config using NSUserDefaults.
   *
   * @param name
   *  The name of the config.
   * @param value
   *  The value of the config.
   */
  set: function(name, value) {
    defaults.setObject_forKey(value, name);
    defaults.synchronize();
  },

  /**
   * Returns the value of config from NSUserDefaults.
   *
   * @param name
   *  The name of the config.
   */
  get: function(name) {
    return defaults.objectForKey(name);
  }
};
