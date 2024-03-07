/**
 * A layer that will display indoor data
 *
 * addData takes a GeoJSON feature collection, each feature must have a level
 * property that indicates the level.
 *
 * getLevels can be called to get the array of levels that are present.
 */

L.Indoor = L.Layer.extend({

  options: {
      // by default the levels are expected to be in the level attribute in
      // the feature properties, pass a replacement function in options if
      // this is not the case.
      getLevel: function(feature) {
          return feature.properties.level;
      }
  },

  initialize: function(data, options) {
      L.setOptions(this, options);
      options = this.options;

      var layers = this._layers = {};
      this._map = null;

      if ("level" in this.options) {
          this._level = this.options.level;
      } else {
          this._level = null;
      }

      if ("onEachFeature" in this.options)
          var onEachFeature = this.options.onEachFeature;

      this.options.onEachFeature = function(feature, layer) {
          if (onEachFeature)
              onEachFeature(feature, layer);
      };

      this.addData(data);
  },
  addTo: function (map) {
      map.addLayer(this);
      var indoor = this
      map.on('zoomend', function() { indoor.toggleLabels() })
      return this;
  },
  onAdd: function (map) {
      this._map = map;

      if (this._level === null) {
          var levels = this.getLevels();
          if (levels.length !== 0) {
              this._level = levels[0];
          }
      }

      if (this._level !== null) {
          if (this._level in this._layers) {
              this._map.addLayer(this._layers[this._level]);
          } else {
              // TODO: Display warning?
          }
      }
      this.toggleLabels();
  },
  onRemove: function (map) {
      if (this._level in this._layers) {
          this._map.removeLayer(this._layers[this._level]);
      }

      this._map = null;
  },
  addData: function(data, options) {
    L.setOptions(this, options);
    options = this.options;
    var layers = this._layers,
        features = L.Util.isArray(data) ? data : data.features;

    features.forEach(function (part) {
        var level = (options.level === undefined ? options.getLevel(part) : options.level);
        var layer;
        if (typeof level === 'undefined' || level === null) {
            console.log('Warn: No level set on feature, skipped.');
            return
        }
        if (!("geometry" in part)) {
            // TODO: Not sure if this is still needed/display warning
            return;
        }
        // the feature could be on multiple levels
        if (!L.Util.isArray(level)) { level = [level] }
          level.forEach(function(level) {
            if (level in layers) {
                layer = layers[level];
            } else {
                layer = layers[level] = L.geoJson({
                    type: "FeatureCollection",
                    features: []
                }, options);
                layer.roomLabels = L.featureGroup()
            }

            layer.addData(part);
          });
      });

      // unfortunately it's not possible to select the layer from a feature part, so we loop all again to add the labels
      // https://github.com/Leaflet/Leaflet/issues/4115
      Object.values(layers).forEach(function(layer) {
        if (!layer.roomLabels._leaflet_id) {
          Object.keys(layer._layers).forEach(function(roomLayerId) {
            if (layer._layers[roomLayerId].feature.properties.name) {
              var myIcon = L.divIcon({className: 'room-label', html: layer._layers[roomLayerId].feature.properties.name});
              var textPos = layer._layers[roomLayerId].getBounds().getCenter()
              L.marker(textPos, { icon: myIcon, interactive: false }).addTo(layer.roomLabels);
            }
          })
        }
      })
  },
  getLevels: function() {
      return Object.keys(this._layers);
  },
  getLayers: function() {
      return this._layers;
  },
  toggleLabels: function() {
    if (Number.isInteger(this.options.minCaptionZoom) && this._level !== undefined && this._map.getZoom() >= this.options.minCaptionZoom) {
      this._layers[this._level].addLayer(this._layers[this._level].roomLabels);
    } else if (this._level) {
      this._layers[this._level].removeLayer(this._layers[this._level].roomLabels)
    }
  },
  getLevel: function() {
      return this._level;
  },
  setLevel: function(level) {

      if (typeof(level) === 'object') {
          level = level.newLevel;
      }
      console.log('Setting level to ' + level)

      if (this._level === level)
          return;

      var oldLayer = this._layers[this._level];
      var layer = this._layers[level];

      if (this._map !== null) {
          if (this._map.hasLayer(oldLayer)) {
              this._map.removeLayer(oldLayer);
          }

          if (layer) {
              this._map.addLayer(layer);
          }
      }

      this._level = level;
      this.toggleLabels()
  },
  resetStyle: function (layer) {
    // reset any custom styles
    layer.options = layer.defaultOptions;
    this._setLayerStyle(layer, this.options.style);
    return this;
  },
  _setLayerStyle: function (layer, style) {
    if (typeof style === 'function') {
      style = style(layer.feature);
    }
    if (layer.setStyle) {
      layer.setStyle(style);
    }
  }
});


L.indoor = function(data, options) {
  return new L.Indoor(data, options);
};

L.Control.Level = L.Control.extend({
  includes: L.Evented,

  options: {
      position: 'bottomright',

      // used to get a unique integer for each level to be used to order them
      parseLevel: function(level) {
          return parseInt(level, 10);
      }
  },

  initialize: function(options) {
      L.setOptions(this, options);

      this._map = null;
      this._buttons = {};
      this._listeners = [];
      this._level = options.level;
  },
  onAdd: function(map) {
      var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control-button');

      div.style.font = "18px 'Lucida Console',Monaco,monospace";

      var buttons = this._buttons;
      var activeLevel = this._level;
      var self = this;

      var levels = [];

      for (var i=0; i<this.options.levels.length; i++) {
          var level = this.options.levels[i];

          var levelNum = self.options.parseLevel(level);

          levels.push({
              num: levelNum,
              label: level
          });
      }

      levels.sort(function(a, b) {
          return a.num - b.num;
      });

      for (i=levels.length-1; i>=0; i--) {
          var level = levels[i].num;
          var originalLevel = levels[i].label;

          var levelBtn = L.DomUtil.create('a', 'leaflet-buttons-control-button', div);
          levelBtn.setAttribute('role','button');
          levelBtn.style.cursor = 'pointer';

          if (level === activeLevel || originalLevel === activeLevel) {
              levelBtn.style.backgroundColor = "#b0b0b0";
          }

          levelBtn.appendChild(levelBtn.ownerDocument.createTextNode(originalLevel));

          (function(level) {
              levelBtn.onclick = function() {
                  self.setLevel(level);
                  self.options.reset()
              };
          })(level);

          buttons[level] = levelBtn;
      }

      return div;
  },
  setLevel: function(level) {
      if (level === this._level)
          return;
      var oldLevel = this._level;
      this._level = level;

      if (this._map !== null) {
          if (typeof oldLevel !== "undefined")
              this._buttons[oldLevel].style.backgroundColor = "#FFFFFF";
          this._buttons[level].style.backgroundColor = "#b0b0b0";
      }

      if(typeof this.options.indoorLayer.setLevel === 'function'){
          this.options.indoorLayer.setLevel({
              oldLevel: oldLevel,
              newLevel: level
          })
      }
  },
  getLevel: function() {
      return this._level;
  },
});

L.Control.level = function (options) {
  return new L.Control.Level(options);
};

