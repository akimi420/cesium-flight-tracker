Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain()
});
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671, // 経度（東京）
    35.6812,  // 緯度
    1500000   // 高さ（m）
  )
});

const position = Cesium.Cartesian3.fromDegrees(
  139.7671,
  35.6812,
  10000
);

const airplane = viewer.entities.add({
  name: "Airplane",
  position: position,
  model: {
    uri: "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 64
  }
});

viewer.trackedEntity = airplane;

