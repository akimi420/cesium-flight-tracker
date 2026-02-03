// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true
});

viewer.scene.primitives.add(Cesium.createOsmBuildings());

const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate());

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.3;

// 飛行ルート（低空）
const path = new Cesium.SampledPositionProperty();
path.addSample(start, Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 120));
path.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(139.9, 35.75, 150)
);

const plane = viewer.entities.add({
  position: path,
  orientation: new Cesium.VelocityOrientationProperty(path),
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  model: {
    uri: "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 80
  }
});

// ★ 手動追従カメラ
viewer.scene.preUpdate.addEventListener(() => {
  const t = viewer.clock.currentTime;
  const pos = plane.position.getValue(t);
  const ori = plane.orientation.getValue(t);
  if (!pos || !ori) return;

  const offset = new Cesium.Cartesian3(-15, 0, 6);
  const m = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromQuaternion(ori),
    pos
  );

  const camPos = Cesium.Matrix4.multiplyByPoint(
    m,
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
