import L from 'leaflet'
export const Indoor =  L.Class.extend({

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

            if ("markerForFeature" in options) {
                var marker = options.markerForFeature(feature);
                if (typeof(marker) !== 'undefined') {
                    marker.on('click', function(e) {
                        layer.fire('click', e);
                    });

                    var level = options.getLevel(feature);

                    if (typeof(level) === 'undefined') {
                        console.warn("level undefined for");
                        console.log(feature);
                    } else {
                        function addToLevel(level) {
                            layers[level].addLayer(marker);
                        }

                        if (L.Util.isArray(level)) {
                            level.forEach(addToLevel);
                        } else {
                            addToLevel(level);
                        }
                    }
                }
            }
        };

        this.addData(data);
    },
    addTo: function (map) {
        map.addLayer(this);
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
    },
    onRemove: function (map) {
        if (this._level in this._layers) {
            this._map.removeLayer(this._layers[this._level]);
        }

        this._map = null;
    },
    addData: function(data) {
        var layers = this._layers,
            options = this.options,
            features = L.Util.isArray(data) ? data : [];

        features.forEach(function (part) {

            var level = options.getLevel(part);

            var layer;

            if (typeof level === 'undefined' ||
                level === null) {
                // TODO: Display warning

                return;
            }

            if (!("geometry" in part)) {
                // TODO: Not sure if this is still needed/display warning
                return;
            }

            // if the feature is on mutiple levels
            if (L.Util.isArray(level)) {
                level.forEach(function(level) {
                    if (level in layers) {
                        layer = layers[level];
                    } else {
                        layer = layers[level] = L.geoJson({
                            type: "FeatureCollection",
                            features: []
                        }, options);
                    }

                    layer.addData(part);
                });
            } else { // feature is on a single level
                if (level in layers) {
                    layer = layers[level];
                } else {
                    layer = layers[level] = L.geoJson({
                        type: "FeatureCollection",
                        features: []
                    }, options);
                }

                layer.addData(part);
            }
        });
    },
    getLevels: function() {
        return Object.keys(this._layers);
    },
    getLevel: function() {
        return this._level;
    },
    setLevel: function(level) {
        if (typeof(level) === 'object') {
            level = level.newLevel;
        }

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
