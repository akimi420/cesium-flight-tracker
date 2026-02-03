// ===============================
// Japan Round Trip Route Data
// Web 3D GIS / CesiumJS 用
// ===============================

// 各地点：実在する都市の緯度・経度
// altitude はメートル（地表からの高さ）
export const japanRoute = [
  { name: "東京",     lon: 139.7671, lat: 35.6812, altitude: 800 },
  { name: "仙台",     lon: 140.8719, lat: 38.2682, altitude: 1200 },
  { name: "札幌",     lon: 141.3545, lat: 43.0621, altitude: 1500 },
  { name: "稚内",     lon: 141.6730, lat: 45.4156, altitude: 1800 },
  { name: "函館",     lon: 140.7290, lat: 41.7687, altitude: 1500 },
  { name: "新潟",     lon: 139.0232, lat: 37.9161, altitude: 1200 },
  { name: "金沢",     lon: 136.6562, lat: 36.5613, altitude: 1200 },
  { name: "大阪",     lon: 135.5023, lat: 34.6937, altitude: 1000 },
  { name: "広島",     lon: 132.4596, lat: 34.3853, altitude: 1000 },
  { name: "福岡",     lon: 130.4017, lat: 33.5902, altitude: 1200 },
  { name: "鹿児島",   lon: 130.5571, lat: 31.5966, altitude: 1500 },
  { name: "那覇",     lon: 127.6792, lat: 26.2124, altitude: 2000 },
  { name: "高松",     lon: 134.0434, lat: 34.3428, altitude: 1200 },
  { name: "東京（戻り）", lon: 139.7671, lat: 35.6812, altitude: 800 }
];

// ===============================
// Cesium SampledPositionProperty を生成
// ===============================
// viewer / Cesium が読み込まれている前提
export function createJapanFlightPath(startTime, secondsPerPoint = 20) {
  const property = new Cesium.SampledPositionProperty();

  japanRoute.forEach((p, i) => {
    const time = Cesium.JulianDate.addSeconds(
      startTime,
      i * secondsPerPoint,
      new Cesium.JulianDate()
    );

    property.addSample(
      time,
      Cesium.Cartesian3.fromDegrees(
        p.lon,
        p.lat,
        p.altitude
      )
    );
  });

  return property;
}
