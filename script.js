// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken =
  "あなたのトークン";

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
// 初期カメラ（東京を斜め上から）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    80000
  ),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-45),
    roll: 0
  }
});

// ===============================
// Time settings
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
viewer.clock.multiplier = 1;

// ===============================
// Flight path（高度が変わる）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    300   // 300m
  )
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(
    140.1,
    35.9,
    3000  // 3000m
  )
);

flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(
    140.5,
    36.2,
    8000  // 8000m
  )
);

// ===============================
// Airplane
// ===============================
const airplane = viewer.entities.add({
  name: "Flight",
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 120,
    maximumScale: 500
  },

  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 3
  }
});

// ===============================
// Tracking Camera
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -1500, // 後ろ
  600,   // 横
  800    // 上
);

setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 1000);
