(function () {
  var Scenery = function (id, settings) {
    this._container = typeof id === 'string' ? document.getElementById(id) : id;
    
    this.settings = this._extend_object({
      sequenced_in_class_name: "scenery-sequenced-in"
    }, settings || {});

    this.setScenes();

    return this;
  };

  Scenery.prototype = {
    // Sets the scenes array by scanning the child nodes for scene elements.
    setScenes: function () {
      var i = 1,
          elements = this._container.querySelectorAll('[data-scenery-scene="' + i + '"]'),
          scenes = [],
          scene;

      while (elements.length > 0) {
        scene = [];

        for (var j = 0; j < elements.length; j++) {
          scene.push(elements[j]);
        }

        scene = this._order_ele_array_by_attribute(scene, 'data-scenery-sequence', '1');

        scenes.push(scene);

        scene = [];

        i++;
        elements = this._container.querySelectorAll('[data-scenery-scene="' + i + '"]');
      }

      this._scenes = scenes;

      return this._scenes;
    },

    begin: function (scene) {
      var scene = typeof scene === 'number' ? scene : 0;

      this._emit_event(this._container, 'scenery:began', { sceneIndex: scene });
    },

    destroy: function () {
      this._emit_event(this._container, 'scenery:destroyed');
    },

    // Methods intended to be executed indirectly

    _order_ele_array_by_attribute: function (array, attribute, default_value) {
      return array.sort(function (a, b) {
        var attrA = a.getAttribute(attribute) || default_value,
            attrB = b.getAttribute(attribute) || default_value;

        if (attrA < attrB) {
          return -1;
        } else if (attrA > attrB) {
          return 1;
        } else {
          return 0;
        }
      });
    },

    _extend_object: function (destination, source) {
      for (var property in source)
        destination[property] = source[property];
      return destination;
    },

    _emit_event: function (ele, name, detail) {
      var detail = detail || {},
          event;

      if (window.CustomEvent) {
        event = new CustomEvent(name, { detail: detail });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, true, true, detail);
      }

      ele.dispatchEvent(event);
    }
  };

  this.Scenery = Scenery;
}.call(this));
