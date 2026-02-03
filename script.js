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
// 建物（そのまま）
// ===============================
viewer.scene.primitives.add(Cesium.createOsmBuildings());

// ===============================
// 初期カメラ（東京・かなり近い）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    1200   // ← 低め
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
viewer.clock.multiplier = 0.3;

// ===============================
// 飛行ルート（地面すれすれ・安定）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 120)
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(139.9, 35.75, 150)
);

flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(140.1, 35.85, 180)
);

// ===============================
// 飛行機
// ===============================
const airplane = viewer.entities.add({
  name: "Airplane",
  position: flightPath,

  // ★ 地面基準（これだけ残す）
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 90,
    maximumScale: 250
  },

  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 2
  }
});

// ===============================
// ★ マイクラ第三者視点（確実に近い）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -8,   // 後ろ 8m
  0,
  3     // 上 3m
);

// 視点固定（遠くならない）
viewer.scene.preUpdate.addEventListener(() => {
  if (viewer.trackedEntity === airplane) {
    viewer.camera.pitch = Cesium.Math.toRadians(-20);
  }
});

// ===============================
// 追跡開始
// ===============================
setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 1500);
