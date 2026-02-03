const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1) // 世界地形
    }),
    imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }), // 衛星画像
    shouldAnimate: true,
    timeline: true,
    animation: true
});

// 初期カメラ（東京・低空）
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 500),
    orientation: { heading: 0, pitch: Cesium.Math.toRadians(-25), roll: 0 }
});

// 時間
const start = Cesium.JulianDate.now();
const stop = Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate());
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 0.5;

// 飛行ルート
const flightPath = new Cesium.SampledPositionProperty();
flightPath.addSample(start, Cesium.Cartesian3.fromDegrees(139.7671, 35.6812, 150));
flightPath.addSample(stop, Cesium.Cartesian3.fromDegrees(139.9, 35.75, 150));

// 飛行機
const plane = viewer.entities.add({
    name: "Airplane",
    position: flightPath,
    orientation: new Cesium.VelocityOrientationProperty(flightPath),
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    model: {
        uri: "https://cesium.com/downloads/cesiumjs/releases/1.114/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
        minimumPixelSize: 80,
        maximumScale: 300
    },
    path: { resolution: 1, material: Cesium.Color.CYAN, width: 3 }
});

// 第三者視点カメラ（手動追従）
viewer.scene.preUpdate.addEventListener(() => {
    const t = viewer.clock.currentTime;
    const pos = plane.position.getValue(t);
    const ori = plane.orientation.getValue(t);
    if (!pos || !ori) return;

    const offset = new Cesium.Cartesian3(-50, 0, 20);
    const transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(ori), pos);
    const camPos = Cesium.Matrix4.multiplyByPoint(transform, offset, new Cesium.Cartesian3());

    viewer.camera.setView({
        destination: camPos,
        orientation: { pitch: Cesium.Math.toRadians(-15), roll: 0 }
    });
});

// 少し待って追跡開始
setTimeout(() => { viewer.trackedEntity = plane; }, 1000);
