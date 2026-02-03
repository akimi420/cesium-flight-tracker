Cesium.Ion.defaultAccessToken = "あなたのトークン";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

// ★ 追跡は絶対しない
viewer.trackedEntity = undefined;

// ★ 地球が必ず見える位置
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    3000000 // 3000km（必ず地球が見える）
  )
});
