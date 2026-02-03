// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

// ===============================
// Viewer
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true,
  timeline: true,
  animation: true
});

// ===============================
// 初期カメラ（東京を地上近くから）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    5000 // ★ 地上が見える高さ
  ),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-30),
    roll: 0
  }
});

// ===============================
// 時間設定（ゆっくり）
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(
  start,
  120,
  new Cesium.JulianDate()
);

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.2; // ★ ゆっくり

// ===============================
// 飛行ルート（地上すれすれ）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 50) // 50m
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(139.9, 35.75, 80)
);

flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(140.1, 35.85, 100)
);

// ===============================
// 飛行機エンティティ
// ===============================
const airplane = viewer.entities.add({
  name: "Airplane",
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 120,
    maximumScale: 300
  },

  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 3
  }
});

// ===============================
// ★ マイクラ第三者視点（超重要）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -60, // 後ろ
  0,   // 横
  20   // 上（低い）
);

// カメラ角度を固定（酔わない）
viewer.scene.preUpdate.addEventListener(() => {
  if (viewer.trackedEntity === airplane) {
    viewer.camera.pitch = Cesium.Math.toRadians(-15);
  }
});

// ===============================
// 追跡開始（少し待つ）
// ===============================
setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 2000);
