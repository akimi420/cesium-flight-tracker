Cesium.Ion.defaultAccessToken = "あなたのトークン";

const viewer = new Cesium.Viewer("cesiumContainer");

// ★ これが効かなければ100%キャッシュ問題
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671, // 東京
    35.6812,
    2000000
  )
});
