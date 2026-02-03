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
// Initial Camera (Tokyo 上空・近め)
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671, // 経度（東京駅）
    35.6812,  // 緯度
    150000    // 初期高度（m）
  )
});

// ===============================
// Time settings
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(
  start,
  120, // 2分飛行
  new Cesium.JulianDate()
);

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 1;

// ===============================
// Flight path（低空）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

// 出発（東京）
flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    800 // ★ 低空
  )
);

// 中間
flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(
    140.1,
    35.9,
    800
  )
);

// 到着
flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(
    140.5,
    36.2,
    800
  )
);

// ===============================
// Airplane Entity
// ===============================
const airplane = viewer.entities.add({
  name: "Flight",
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: start,
      stop: stop
    })
  ]),
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",

    // ★ 見た目調整（重要）
    minimumPixelSize: 80,
    maximumScale: 300
  },

  // 飛行ルート表示
  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 3
  }
});

// ===============================
// Tracking Camera（超重要）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -800, // 後ろ
  0,
  200   // 少し上
);

// trackedEntity は少し遅らせる（安定）
setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 1000);

// ===============================
// UI 表示
// ===============================
viewer.timeline.container.style.visibility = "visible";
viewer.animation.container.style.visibility = "visible";

// ===============================
// おまけ：デバッグ用（カメラ解除）
// ===============================
// キー「C」で追跡ON/OFF
window.addEventListener("keydown", (e) => {
  if (e.key === "c") {
    viewer.trackedEntity =
      viewer.trackedEntity ? undefined : airplane;
  }
});
