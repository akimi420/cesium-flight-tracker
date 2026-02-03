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

viewer.scene.primitives.add(Cesium.createOsmBuildings());

// ===============================
// 初期カメラ（東京）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 1500),
  orientation: {
    pitch: Cesium.Math.toRadians(-25)
  }
});

// ===============================
// 時間
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(start, 120, new Cesium.JulianDate());

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.3;

// ===============================
// 飛行ルート
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
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 80,
    maximumScale: 200
  }
});

// ===============================
// ★ 手動カメラ追従（第三者視点）
// ===============================
viewer.scene.preUpdate.addEventListener(() => {
  const time = viewer.clock.currentTime;
  const pos = airplane.position.getValue(time);
  const ori = airplane.orientation.getValue(time);
  if (!pos || !ori) return;

  // 後ろ＆上から見る（マイクラ視点）
  const offset = new Cesium.Cartesian3(-10, 0, 4);
  const transform = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromQuaternion(ori),
    pos
  );

  const cameraPos = Cesium.Matrix4.multiplyByPoint(
    transform,
    offset,
    new Cesium.Cartesian3()
  );

  viewer.camera.setView({
    destination: cameraPos,
    orientation: {
      heading: viewer.camera.heading,
      pitch: Cesium.Math.toRadians(-15),
      roll: 0
    }
  });
});
