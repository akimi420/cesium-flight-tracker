// ===============================
// Cesium Ion Token
// ===============================
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGFlMzRjZi0xMTg2LTQyMWItYjEyOS02YWNlZTk4NDY2OTUiLCJpZCI6MzgxMDgzLCJpYXQiOjE3Njg4OTUxNzd9.thBsRrp8DmJxjSndUnz6rSJTf0VtEfqGSRE-OWEdznA";

// ===============================
// Viewer（地球＋地形）
// ===============================
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  shouldAnimate: true,
  timeline: true,
  animation: true
});

// ===============================
// 建物（都市感）
// ===============================
viewer.scene.primitives.add(Cesium.createOsmBuildings());

// ===============================
// 初期カメラ（東京・地上近く）
// ===============================
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    139.7671,
    35.6812,
    1500
  ),
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-35),
    roll: 0
  }
});

// ===============================
// 時間設定（ゆっくり）
// ===============================
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(
  start,
  180,
  new Cesium.JulianDate()
);

viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.2;

// ===============================
// 日本主要都市
// ===============================
const cities = [
  { name: "東京", lon: 139.7671, lat: 35.6812, shown: false },
  { name: "名古屋", lon: 136.8815, lat: 35.1709, shown: false },
  { name: "大阪", lon: 135.5023, lat: 34.6937, shown: false },
  { name: "福岡", lon: 130.4017, lat: 33.5902, shown: false },
  { name: "札幌", lon: 141.3545, lat: 43.0618, shown: false }
];

// ===============================
// 飛行ルート（地面すれすれ）
// ===============================
const flightPath = new Cesium.SampledPositionProperty();

flightPath.addSample(
  start,
  Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 150)
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(138.9, 35.3, 200)
);

flightPath.addSample(
  Cesium.JulianDate.addSeconds(start, 120, new Cesium.JulianDate()),
  Cesium.Cartesian3.fromDegrees(136.8815, 35.1709, 250)
);

flightPath.addSample(
  stop,
  Cesium.Cartesian3.fromDegrees(135.5023, 34.6937, 300)
);

// ===============================
// 飛行機
// ===============================
const airplane = viewer.entities.add({
  name: "Airplane",
  position: flightPath,

  // 地面基準（超重要）
  heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,

  orientation: new Cesium.VelocityOrientationProperty(flightPath),

  model: {
    uri:
      "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
    minimumPixelSize: 100,
    maximumScale: 300
  },

  path: {
    resolution: 1,
    material: Cesium.Color.CYAN,
    width: 3
  }
});

// ===============================
// ★ マイクラ第三者視点（激近）
// ===============================
airplane.viewFrom = new Cesium.Cartesian3(
  -12, // 後ろ 12m
  0,
  4    // 上 4m
);

// カメラ角度固定
viewer.scene.preUpdate.addEventListener(() => {
  if (viewer.trackedEntity === airplane) {
    viewer.camera.pitch = Cesium.Math.toRadians(-25);
  }
});

// ===============================
// 都市上空判定 → 名前表示
// ===============================
viewer.clock.onTick.addEventListener(() => {
  const pos = airplane.position.getValue(viewer.clock.currentTime);
  if (!pos) return;

  cities.forEach(city => {
    if (city.shown) return;

    const cityPos = Cesium.Cartesian3.fromDegrees(
      city.lon,
      city.lat,
      0
    );

    const dist = Cesium.Cartesian3.distance(pos, cityPos);

    // 半径30km
    if (dist < 30000) {
      city.shown = true;
      showCityLabel(city);
    }
  });
});

function showCityLabel(city) {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(
      city.lon,
      city.lat,
      100
    ),
    label: {
      text: city.name,
      font: "28px sans-serif",
      fillColor: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 4,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -20)
    }
  });
}

// ===============================
// 追跡開始
// ===============================
setTimeout(() => {
  viewer.trackedEntity = airplane;
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}, 2000);
