// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

// ===============================
// route.js 読み込み
// ===============================
import { japanRoute, createJapanFlightPath } from "./route.js";

// ===============================
// Viewer（★ 地球が必ず見える構成）
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true,
  timeline: true,
  animation: true
});
// 地形の陰影（地上感アップ）
viewer.scene.globe.enableLighting = true;

// ===============================
// 初期カメラ（日本全体）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    138.0,   // 日本の中央付近
    37.0,
    2500000  // 日本全体が見える高さ
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
const secondsPerPoint = 25;

const stop = Cesium.JulianDate.addSeconds(
  start,
  secondsPerPoint * (japanRoute.length - 1),
  new Cesium.JulianDate()
);

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 1;

// ===============================
// 日本一周フライトパス生成
// ===============================
const flightPath = createJapanFlightPath(start, secondsPerPoint);

// ===============================
// 飛行機エンティティ
// ===============================
const airplane = viewer.entities.add({
  name: "Japan Round Trip Flight",

  position: flightPath,
  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 120,
    maximumScale: 400
  },

  path: {
    resolution: 1,
    material: Cesium.Color.ORANGE,
    width: 3
  }
});

// ===============================
// 都市マーカー & ラベル（GIS感UP）
// ===============================
japanRoute.forEach((p) => {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 0),
    label: {
      text: p.name,
      font: "14px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -10)
    },
    point: {
      pixelSize: 6,
      color: Cesium.Color.RED
    }
  });
});

// ===============================
// 追跡カメラ（地上寄り・安定）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -800, // 後ろ
  0,
  300   // 上（低すぎると地面に刺さる）
);

// 少し待ってから追跡開始（★ 安定）
setTimeout(() => {
  viewer.trackedEntity = airplane;
}, 1500);

// ===============================
// デバッグ操作
// ===============================

// Cキー：追跡 ON / OFF
window.addEventListener("keydown", (e) => {
  if (e.key === "c") {
    viewer.trackedEntity =
      viewer.trackedEntity ? undefined : airplane;
  }
});

// Rキー：日本全体に戻る
window.addEventListener("keydown", (e) => {
  if (e.key === "r") {
    viewer.trackedEntity = undefined;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        138.0,
        37.0,
        2500000
      )
    });
  }
});
