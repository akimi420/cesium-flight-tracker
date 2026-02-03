// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

// ===============================
// Viewer（余計な機能は切る）
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  animation: false,
  timeline: false,
  shouldAnimate: true
});

// ===============================
// 初期カメラ（東京・確実に地表が見える）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671, // 東京
    35.6812,
    3000      // ★ 地球にならない安全高度
  ),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-35),
    roll: 0
  }
});

// ===============================
// 時間設定
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
// 飛行ルート（地形を突き抜けない高さ）
// ===============================
const path = new Cesium.SampledPositionProperty();

path.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    800   // ★ 地面から 800m
  )
);

path.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(
    139.9,
    35.75,
    800
  )
);

// ===============================
// 飛行機エンティティ
// ===============================
const plane = viewer.entities.add({
  name: "Airplane",
  position: path,
  orientation: new Cesium.VelocityOrientationProperty(path),

  // ★ 地面基準（超重要）
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 100
  },

  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 3
  }
});

// ===============================
// ★ 安定した第三者視点（マイクラ視点）
// ===============================
viewer.scene.preUpdate.addEventListener(() => {
  const time = viewer.clock.currentTime;
  const pos = plane.position.getValue(time);
  const ori = plane.orientation.getValue(time);

  if (!pos || !ori) return;

  // 後ろ・少し上
  const offset = new Cesium.Cartesian3(-80, 0, 30);

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
      pitch: Cesium.Math.toRadians(-15),
      roll: 0
    }
  });
});
