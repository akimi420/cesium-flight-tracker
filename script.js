// ===============================
// Cesium Ion Token（あなたのトークン）
// ===============================
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

// ===============================
// Viewer（★ これが安定構成）
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true,
  timeline: true,
  animation: true,
  baseLayerPicker: false
});

// ===============================
// 初期カメラ（東京上空・地球が必ず見える）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    150000
  ),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0
  }
});

// ===============================
// 時間設定（ゆっくり）
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(
  start,
  300,
  new Cesium.JulianDate()
);

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.2; // ★ 重要：速すぎ防止

// ===============================
// 日本一周ルート（地上すれすれ）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

// 東京
flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 200)
);

// 仙台
flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(140.8719, 38.2682, 300)
);

// 札幌
flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 120, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(141.3545, 43.0621, 400)
);

// 大阪
flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 200, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(135.5023, 34.6937, 300)
);

// 福岡
flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(130.4017, 33.5902, 200)
);

// ===============================
// 飛行機エンティティ
// ===============================
const airplane = viewer.entities.add({
  name: "Japan Flight",
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 120,
    maximumScale: 400
  },

  path: {
    resolution: 1,
    material: Cesium.Color.YELLOW,
    width: 4
  }
});

// ===============================
// 追跡カメラ（地上感）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -250, // 後ろ
  0,
  100   // 上（低い）
);

// 少し待ってから追跡開始
setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 3000);

// ===============================
// デバッグ：Cキーで追跡ON/OFF
// ===============================
window.addEventListener("keydown", (e) => {
  if (e.key === "c") {
    viewer.trackedEntity =
      viewer.trackedEntity ? undefined : airplane;
  }
});
