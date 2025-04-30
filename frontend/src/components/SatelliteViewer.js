import React, { useEffect, useRef, useState } from "react";
import { Viewer, Entity, PointGraphics, LabelGraphics } from "resium";
import { Cartesian3, Color, Ion, BoundingSphere, HeadingPitchRange, Math as CesiumMath } from "cesium";
import * as satellite from "satellite.js";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1OTUzOTIwZi1iZmQ4LTRhYmItYjEyMC0xZWNmMzcxNDJjMmUiLCJpZCI6MjkzOTg3LCJpYXQiOjE3NDU5MzM0ODF9.rd-s4XlbgzZWXO8zu4iv9d38Pa29awWHLTl5VTbjjwI";

function tleToCartesian3(tle1, tle2, time = new Date()) {
  try {
    const satrec = satellite.twoline2satrec(tle1, tle2);
    const positionAndVelocity = satellite.propagate(satrec, time);
    const positionEci = positionAndVelocity.position;
    if (!positionEci) return null;
    const gmst = satellite.gstime(time);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const latitude = satellite.degreesLat(positionGd.latitude);
    const height = positionGd.height * 1000; // km to meters
    return Cartesian3.fromDegrees(longitude, latitude, height);
  } catch {
    return null;
  }
}

function SatelliteViewer({ satellites = [], selectedSatId }) {
  const viewerRef = useRef();
  const [positions, setPositions] = useState([]);

  // Only update positions every 1 second to avoid flicker
  useEffect(() => {
    let animationFrame;
    let lastUpdate = 0;
    function updatePositions() {
      const now = Date.now();
      if (now - lastUpdate > 1000) {
        const time = new Date();
        const newPositions = satellites.map(sat => ({
          ...sat,
          cartesian: tleToCartesian3(sat.tle_line1, sat.tle_line2, time),
        }));
        setPositions(newPositions);
        lastUpdate = now;
      }
      animationFrame = requestAnimationFrame(updatePositions);
    }
    updatePositions();
    return () => cancelAnimationFrame(animationFrame);
  }, [satellites]);

  // Only auto-move camera on first load or when satellites change
  const initialCameraSet = useRef(false);
  useEffect(() => {
    if (!viewerRef.current || !viewerRef.current.cesiumElement) return;
    const viewer = viewerRef.current.cesiumElement;
    const validPositions = positions.filter(s => s.cartesian);
    if (validPositions.length === 0) return;
    if (!initialCameraSet.current) {
      if (validPositions.length === 1) {
        viewer.camera.flyTo({
          destination: validPositions[0].cartesian,
          duration: 1.5,
        });
      } else {
        const points = validPositions.map(s => s.cartesian);
        const boundingSphere = BoundingSphere.fromPoints(points);
        viewer.camera.flyToBoundingSphere(boundingSphere, {
          duration: 1.5,
          offset: new HeadingPitchRange(CesiumMath.toRadians(45), CesiumMath.toRadians(-30), boundingSphere.radius * 2),
        });
      }
      initialCameraSet.current = true;
    }
    // Enable all controls
    viewer.scene.screenSpaceCameraController.enableRotate = true;
    viewer.scene.screenSpaceCameraController.enableZoom = true;
    viewer.scene.screenSpaceCameraController.enableTilt = true;
    viewer.scene.screenSpaceCameraController.enableLook = true;
    viewer.scene.screenSpaceCameraController.enableTranslate = true;
  }, [positions]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Viewer
        style={{ width: "100%", height: "100%" }}
        ref={viewerRef}
        shouldAnimate
        animation
        timeline
        navigationHelpButton
        homeButton
        sceneModePicker
        geocoder
        baseLayerPicker
        fullscreenButton
        infoBox
        selectionIndicator
      >
        {positions.map(sat => sat.cartesian && (
          <Entity
            key={sat.id}
            name={sat.name}
            position={sat.cartesian}
            description={`<b>Name:</b> ${sat.name}<br/><b>NORAD ID:</b> ${sat.norad_id}`}
          >
            <PointGraphics
              pixelSize={sat.id === selectedSatId ? 16 : 10}
              color={Color.YELLOW}
              outlineColor={Color.WHITE}
              outlineWidth={sat.id === selectedSatId ? 6 : 0}
              show
            />
            <LabelGraphics
              text={`${sat.name} (NORAD: ${sat.norad_id})`}
              fillColor={Color.YELLOW}
            />
          </Entity>
        ))}
      </Viewer>
    </div>
  );
}

export default SatelliteViewer;
