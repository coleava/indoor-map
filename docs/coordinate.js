// BaiDu js: https://api.map.baidu.com/getscript?v=2.0&ak=E4805d16520de693a3fe707cdc962045&services=&t=20210113094335
// BaiDu js version: 104
// Baidu js updateDate: 20210126

var j = void 0, // undefined
	o = !0, // true
	p = null;

// 初始化坐标检查, 确保初始化时是 float,float
// 源函数 H
function H(a, b) {
    a = isNaN(a) ? 0 : a;
    "string" == typeof a && (a = parseFloat(a));
    b = isNaN(b) ? 0 : b;
    "string" == typeof b && (b = parseFloat(b));
	return {lng: a, lat: b};
}

var dc = 3E3,
    ec = 2.0E-5,
    fc = 3.0E-6,
    gc = 0.0174532925194, 
    hc = 0.0065, 
    ic = 0.0060;


// GCJ02toBD09 火星坐标系->百度坐标系
// 源函数: qc
function gcj02tobd09(a) {
    var b = a.lng,
        c = a.lat,
        a = Math.sqrt(b * b + c * c) + Math.sin(c * dc * gc) * ec,
        b = Math.atan2(c, b) + Math.cos(b * dc * gc) * fc;
    return {
        lng: a * Math.cos(b) + hc,
        lat: a * Math.sin(b) + ic
    }
}

// BD09toGCJ02: 百度坐标系->火星坐标系
// 源函数: BC
function bd09togcj02(a) {
	var b = a.lng - hc,
	c = a.lat - ic,
	a = Math.sqrt(b * b + c * c) - Math.sin(c * dc * gc) * ec,
	b = Math.atan2(c, b) - Math.cos(b * dc * gc) * fc;
	return b = {
		lng: a * Math.cos(b),
		lat: a * Math.sin(b)
	}
}

// T: object
T = {
    CP: 6370996.81,  // 地球半径 m
    JG: [1.289059486E7, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
    Lu: [75, 60, 45, 30, 15, 0],
    IP: [
        [1.410526172116255E-8, 8.98305509648872E-6, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 1.73379812E7],
        [-7.435856389565537E-9, 8.983055097726239E-6, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 1.026014486E7],
        [-3.030883460898826E-8, 8.98305509983578E-6, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
        [-1.981981304930552E-8, 8.983055099779535E-6, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
        [3.09191371068437E-9, 8.983055096812155E-6, 6.995724062E-5, 23.10934304144901, -2.3663490511E-4, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
        [2.890871144776878E-9, 8.983055095805407E-6, -3.068298E-8, 7.47137025468032, -3.53937994E-6, -0.02145144861037, -1.234426596E-5, 1.0322952773E-4, -3.23890364E-6, 826088.5]
    ],
    GG: [
        [-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5],
        [8.277824516172526E-4, 111320.7020463578, 6.477955746671607E8, -4.082003173641316E9, 1.077490566351142E10, -1.517187553151559E10, 1.205306533862167E10, -5.124939663577472E9, 9.133119359512032E8, 67.5],
        [0.00337398766765, 111320.7020202162, 4481351.045890365, -2.339375119931662E7, 7.968221547186455E7, -1.159649932797253E8, 9.723671115602145E7, -4.366194633752821E7, 8477230.501135234, 52.5],
        [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5],
        [-3.441963504368392E-4, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5],
        [-3.218135878613132E-4, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]
    ],
    GK: function(a, b) {
        if (a && b) {
            var c = b[0] + b[1] * Math.abs(a.lng),
                d = Math.abs(a.lat) / b[9],
                d = b[2] + b[3] * d + b[4] * d * d + b[5] * d * d * d + b[6] * d * d * d * d + b[7] * d * d * d * d * d + b[8] * d * d * d * d * d * d,
                c = c * (0 > a.lng ? -1 : 1),
                d = d * (0 > a.lat ? -1 : 1);
            return new H(c, d)
        }
	},
	// 获取最大值
    gE: function(a, b, c) {
        b != p && (a = Math.max(a, b));
        c != p && (a = Math.min(a, c));
        return a
	},
	// 获取 a
    cE: function(a, b, c) {
        for (; a > c;)
            a -= c - b;
        for (; a < b;)
            a += c - b;
        return a
    }
};

// DB09MctoBD09 百度墨卡托坐标系 - > 百度坐标系
// 原函数: T.ub
bd09mctobd09 = function(a) {
	if (a === p || a === j)
		return new H(0, 0);
	var b, c;
	b = new H(Math.abs(a.lng), Math.abs(a.lat));
	for (var d = 0; d < T.JG.length; d++)
		if (b.lat >= T.JG[d]) {
			c = T.IP[d];
			break
		}
	a = T.GK(a, c);
	return a = new H(a.lng, a.lat)
}

// BD09toBD09MC 百度坐标系-> 百度墨卡托坐标系
// 源函数: T.tb
bd09tobd09mc = function(a) {
	if (a === p || a === j || 180 < a.lng || -180 > a.lng || 90 < a.lat || -90 > a.lat)
		return new H(0, 0);
	var b, c;
	a.lng = T.cE(a.lng, -180, 180);
	a.lat = T.gE(a.lat, -74, 74);
	b = new H(a.lng, a.lat);
	for (var d = 0; d < T.Lu.length; d++)
		if (b.lat >= T.Lu[d]) {
			c = T.GG[d];
			break
		}
	if (!c)
		for (d = 0; d < T.Lu.length; d++)
			if (b.lat <= -T.Lu[d]) {
				c = T.GG[d];
				break
			}
	a = T.GK(a, c);
	return a = new H(a.lng, a.lat)
}

// ------------------------- 以上内容是从百度 getscript.js 抽取后获得 ---------------------------------------

Point = H;
defaultPoint = new Point(0, 0);

var OFFSET = 0.00669342162296594323,
    AXIS = 6378245.0;

// 是否超出中国地图
function isOutOfChina(lon, lat) {
    return !(lon > 72.004 && lon < 135.05 && lat > 3.86 && lat < 53.55);
}

// transform
function transform(lon, lat) {
    var lonlat = lon * lat;
    var absX = Math.sqrt(Math.abs(lon));
    var lonPi = lon * Math.PI,
        latPi = lat * Math.PI;
    var d = 20.0 * Math.sin(6.0 * lonPi) + 20.0 * Math.sin(2.0 * lonPi)
    x =y= d
    x += 20.0 * Math.sin(latPi) + 40.0 * Math.sin(latPi / 3.0)
    y += 20.0 * Math.sin(lonPi) + 40.0 * Math.sin(lonPi / 3.0)
    x += 160.0 * Math.sin(latPi / 12.0) + 320 * Math.sin(latPi / 30.0)
    y += 150.0 * Math.sin(lonPi / 12.0) + 300.0 * Math.sin(lonPi / 30.0)
    x *= 2.0 / 3.0
    y *= 2.0 / 3.0
    x += -100.0 + 2.0 * lon + 3.0 * lat + 0.2 * lat * lat + 0.1 * lonlat + 0.2 * absX
    y += 300.0 + lon + 2.0 * lat + 0.1 * lon * lon + 0.1 * lonlat + 0.1 * absX
    return new Point(x, y);
}

// delta
function delta(lon, lat) {
	p = transform(lon - 105.0, lat - 35)

    dlat = p.lng, dlon = p.lat;
    radlat = lat / 180.0 * Math.PI
    magic = Math.sin(radlat)
    magic = 1 - OFFSET * magic * magic
    sqrtmagic = Math.sqrt(magic)

    dlat = (dlat * 180.0) / ((AXIS ) / (magic * sqrtmagic) * Math.PI)
    dlon = (dlon * 180.0) / (AXIS / sqrtmagic * Math.cos(radlat) * Math.PI)

 
    return new Point(lon + dlon, lat + dlat)
}

function wgs84togcj02(a) {
    lng = a.lng, lat = a.lat;
    if (isOutOfChina(lng, lat)) {
        return defaultPoint;
	}
    return delta(lng, lat);
}

function gcj02towgs84(a) {
    lng = a.lng, lat = a.lat;
    if (isOutOfChina(lng, lat)) {
        return defaultPoint;
    }
    p = delta(lng, lat);
    return new Point(lng * 2 - p.lng, lat * 2 - p.lat)
}

function tomercator(a){
	var x=a.lng,y=a.lat;
	x = x *20037508.34/180;
    y = Math.log(Math.tan((90+y)*Math.PI/360))/(Math.PI/180);
	y = y *20037508.34/180;
	return new Point(x,y);
}

function frommercator(a){
	var x=a.lng,y=a.lat; 
	x = x/20037508.34*180;
   	y = y/20037508.34*180;
	y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
	return new Point(x,y);
}

function bd09towgs84(a) {
    return gcj02towgs84(bd09togcj02(a));
}

function wgs84tobd09(a) {
    return gcj02tobd09(wgs84togcj02(a))
}

// // BD09toGCJ02 百度坐标系 - > 火星坐标系
// BD09toGCJ02 = bd09togcj02;
// // GCJ02toBD09 火星坐标系 - > 百度坐标系
// GCJ02toBD09 = gcj02tobd09;
// // WGS84toGCJ02 WGS84坐标系->火星坐标系
// WGS84toGCJ02 = wgs84togcj02;
// // GCJ02toWGS84 火星坐标系->WGS84坐标系
// GCJ02toWGS84 = gcj02towgs84;
// // BD09toWGS84 百度坐标系->WGS84坐标系
// BD09toWGS84 = bd09towgs84;
// // WGS84toBD09 WGS84坐标系->百度坐标系
// WGS84toBD09 = wgs84tobd09;
// // BD09toBD09MC 百度坐标系-> 百度墨卡托坐标系
// BD09toBD09MC = bd09tobd09mc;
// // DB09MctoBD09 百度墨卡托坐标系 - > 百度坐标系
// DB09MctoBD09 = bd09mctobd09;
// // ToMercator 任意坐标系->墨卡托坐标系
// ToMercator = tomercator
// // FromMercator 墨卡托坐标系->任意坐标系
// FromMercator = frommercator