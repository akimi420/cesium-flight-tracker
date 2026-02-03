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
  animation: false,
  timeline: false,
  shouldAnimate: true
});

// ===============================
// 初期カメラ（東京・低空）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    1000   // ← これ以下だと「地球」にならない
  ),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-25),
    roll: 0
  }
});

// ===============================
// 時間
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(
  start,
  60,
  new Cesium.JulianDate()
);

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.5;

// ===============================
// 飛行ルート（低空）
// ===============================
const path = new Cesium.SampledPositionProperty();
path.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 300)
);
path.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(139.9, 35.75, 300)
);

// ===============================
// 飛行機
// ===============================
const plane = viewer.entities.add({
  position: path,
  orientation: new Cesium.VelocityOrientationProperty(path),
  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 80
  }
});

// ===============================
// ★ 第三者視点カメラ（元の安定版）
// ===============================
viewer.scene.preUpdate.addEventListener(() => {
  const time = viewer.clock.currentTime;
  const pos = plane.position.getValue(time);
  const ori = plane.orientation.getValue(time);

  if (!pos || !ori) return;

  // 後ろ＆少し上（←これが「戻る」感覚）
  const offset = new Cesium.Cartesian3(-40, 0, 15);

  const transform = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromQuaternion(ori),
    pos
  );

  const camPos = Cesium.Matrix4.multiplyByPoint(
    transform,
    offset,
    new Cesium.Cartesian3()
  );

  viewer.camera.setView({
    destination: camPos,
    orientation: {
      pitch: Cesium.Math.toRadians(-15),
      roll: 0
    }
  });
});
