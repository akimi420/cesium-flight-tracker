viewer.trackedEntity = undefined;

viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    200 // ★ 200m
  ),
  orientation: {
    heading: Cesium.Math.toRadians(90),
    pitch: Cesium.Math.toRadians(-10),
    roll: 0
  }
});
