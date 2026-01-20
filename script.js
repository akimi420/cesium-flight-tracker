Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

const viewer = new Cesium.Viewer("cesiumContainer");

// ★ これが効かなければ100%キャッシュ問題
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671, // 東京
    35.6812,
    2000000
  )
});
