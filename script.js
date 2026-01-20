Cesium.Ion.defaultAccessToken = "新しいトークン";

const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true
});

// 東京固定（これが基準）
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    2000000
  )
});

// 飛行機（静止）
const airplane = viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 10000),
  model: {
    uri: "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 64
  }
});
