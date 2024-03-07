L.TileLayer.ChinaProvider = L.TileLayer.extend({

  initialize: function(type, options) { // (type, Object)
      var providers = L.TileLayer.ChinaProvider.providers;

      var parts = type.split('.');

      var providerName = parts[0];
      var mapName = parts[1];
      var mapType = parts[2];

      var url = providers[providerName][mapName][mapType];
      options.subdomains = providers[providerName].Subdomains;

      L.TileLayer.prototype.initialize.call(this, url, options);
  }
});

L.TileLayer.ChinaProvider.providers = {
  TianDiTu: {
      Normal: {
          Map: "http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
          Annotion: "http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}"
      },
      Satellite: {
          Map: "http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
          Annotion: "http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}"
      },
      Terrain: {
          Map: "http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
          Annotion: "http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}"
      },
      Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
  },

  GaoDe: {
      Normal: {
          Map: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
      },
      Satellite: {
          Map: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          Annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
      },
      Subdomains: ["1", "2", "3", "4"]
  },

  Google: {
      Normal: {
          Map: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
      },
      Satellite: {
          Map: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
      },
      Subdomains: []
  },

  Geoq: {
      Normal: {
          Map: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
          Color: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetColor/MapServer/tile/{z}/{y}/{x}",
          PurplishBlue: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
          Gray: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
          Warm: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
          Cold: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetCold/MapServer/tile/{z}/{y}/{x}"
      },
      Subdomains: []
  },
  
  OSM: {
    Normal: {
        Map: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    Subdomains: ['a', 'b', 'c']
},

Baidu: {
    Normal: {
        Map: 'http://online{s}.map.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt='
    },
    Satellite: {
        Map: '//shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46',
        Annotion: '//online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020'
    },
    Subdomains: '0123456789',
    tms: true
},

Tencent: {
    Normal: {
        Map: "http://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={-y}&type=vector&styleid=3",
    },
    Satellite: {
        Map: "http://p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg",
    },
    Terrain: {
        Map: "http://p{s}.map.gtimg.com/demTiles/{z}/{sx}/{sy}/{x}_{-y}.jpg"
    },
    Subdomains: '0123',
}
};

L.tileLayer.chinaProvider = function(type, options) {
  return new L.TileLayer.ChinaProvider(type, options);
};
