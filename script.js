// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

// ===============================
// Viewer
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true
});

// ===============================
// Camera (Tokyo)
// ===============================
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671, // lon
    35.6812,  // lat
    1500000   // height
  )
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
// Flight path (Sampled positions)
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.5, 35.4, 10000)
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(140.0, 35.8, 10000)
);

flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(140.5, 36.2, 10000)
);

// ===============================
// Airplane entity
// ===============================
const airplane = viewer.entities.add({
  name: "Flight",
  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),
  model: {
    uri: "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 64,
    maximumScale: 200
  },
  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 3
  }
});

// ===============================
// Track airplane
// ===============================
viewer.trackedEntity = airplane;

// ===============================
// UI
// ===============================
viewer.timeline.container.style.visibility = "visible";
viewer.animation.container.style.visibility = "visible";
