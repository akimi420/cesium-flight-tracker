// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken = "あなたのトークン";

// ===============================
// Viewer
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true
});

// 地形の陰影を強調（地面感UP）
viewer.scene.globe.enableLighting = true;

// ===============================
// 初期カメラ（東京・低空）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    500   // ★ 500m
  ),
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-30),
    roll: 0
  }
});

// ===============================
// Time settings
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(start, 120, new Cesium.JulianDate());

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 1;

// ===============================
// Flight path（地上スレスレ）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 50) // ★ 50m
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(139.9, 35.8, 80)
);

flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(140.2, 36.0, 100)
);

// ===============================
// Airplane（地面基準）
// ===============================
const airplane = viewer.entities.add({
  name: "Low Flight",
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  // ★ 地面基準が最重要
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

  model: {
    uri: "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 120,
    maximumScale: 300
  },

  path: {
    resolution: 1,
    material: Cesium.Color.ORANGE,
    width: 3
  }
});

// ===============================
// 追跡カメラ（人間視点）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -200, // 後ろ
  0,
  50    // 少し上
);

viewer.trackedEntity = airplane;
