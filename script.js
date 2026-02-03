// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYjAyOTVmZi02NzdmLTQ2ZDMtYWFmMi1jMjUxYTNiNDdiNzgiLCJpZCI6MzgxMDgzLCJpYXQiOjE3NzAxMjQzNjd9.foHyM6_aGyiCUDXCyacpCkwmL9gjVCvbLciiiaazOCk";

// ===============================
// Viewer 初期化（地形 + 衛星画像）
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1) // World Terrain
  }),
  imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }), // Bing / World Imagery
  shouldAnimate: true,
  timeline: true,
  animation: true
});

// ===============================
// 初期カメラ（東京・低空）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 1000),
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-25),
    roll: 0
  }
});

// ===============================
// 時計設定（Flight Tracker のチュートリアルに合わせる）
// ===============================
// 60秒でループ設定
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate());

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.5;

// ===============================
// Flight Path（低空ルート）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

// 低空サンプル（例: 東京から近くまで）
flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 200) // 200m
);
flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 30, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(140.0, 35.8, 300) // 300m
);
flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(140.2, 36.0, 400) // 400m
);

// ===============================
// 飛行機モデルの追加
// ===============================
const airplane = viewer.entities.add({
  name: "Flight",
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),
  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.138/Build/Cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 80,
    maximumScale: 300
  },
  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 2
  }
});

// ===============================
// カメラ追従（公式 Flight Tracker と同様の trackedEntity）
// ===============================
setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 1000);
