import React, { useEffect,useState } from "react";
import { UserDrawing, useViewState } from "terriajs-plugin-api";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import CallbackProperty from "terriajs-cesium/Source/DataSources/CallbackProperty";

import Polygon, { PositionsArray } from 'terriajs/lib/Map/Cesium/Polygon';
import i18next from "i18next";
import turfArea from '@turf/area';
import { polygon as turfPolygon } from '@turf/helpers';
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import LabelStyle from "terriajs-cesium/Source/Scene/LabelStyle";
import ScreenSpaceEventType from "terriajs-cesium/Source/Core/ScreenSpaceEventType";
import VerticalOrigin from "terriajs-cesium/Source/Scene/VerticalOrigin";
import Color from "terriajs-cesium/Source/Core/Color";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import EllipsoidGeodesic from "terriajs-cesium/Source/Core/EllipsoidGeodesic";
import EllipsoidTangentPlane from "terriajs-cesium/Source/Core/EllipsoidTangentPlane";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import PolygonHierarchy from "terriajs-cesium/Source/Core/PolygonHierarchy";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import Math from "terriajs-cesium/Source/Core/Math";
import defined from "terriajs-cesium/Source/Core/defined";
import ScreenSpaceEventHandler from "terriajs-cesium/Source/Core/ScreenSpaceEventHandler";
import DragPoints from "terriajs/lib/Map/DragPoints/DragPoints";
import sampleTerrainMostDetailed from "terriajs-cesium/Source/Core/sampleTerrainMostDetailed";


import {
  HeightMeasurement,
  MeasureUnits,
  MeasurementMouseHandler,
  DistanceUnits,
} from "@cesiumgs/ion-sdk-measurements";
import {
PrimitiveCollection,
LabelCollection,
PointPrimitiveCollection,
} from "@cesium/engine"
import {
  MapToolbar
} from "terriajs-plugin-api";
import i18next from "i18next";

var closeBtn: any = null;
var heightText: any = null;

/**
 * The main tool component
 */
export default function Main({ viewState }: { viewState: any }) {
  


  const terria = useViewState().terria;
  
  showCenterNote(i18next.t("sdkHeight.sdkHeightPluginNoteTitle"), i18next.t("sdkHeight.sdkHeightPluginNoteMessage"));


  const scene =
    (terria?.currentViewer as any)?.scene ||
    (terria as any)?.viewer?.cesiumWidget?.scene;

  if (!scene) return;

  const primitives =
    (scene.__heightPrimColl ||= scene.primitives.add(new PrimitiveCollection()));
  const labels =
    (scene.__heightLabelColl ||= scene.primitives.add(new LabelCollection()));
  const points =
    (scene.__heightPointColl ||= scene.primitives.add(new PointPrimitiveCollection()));

  const units = new MeasureUnits({ distanceUnits: DistanceUnits.METERS });

  const measure = new HeightMeasurement({
    scene,
    units,
    primitives,
    labels,
    points
  });

  const mouse = new MeasurementMouseHandler(scene);
  mouse.activate();

  const eventHandler = new ScreenSpaceEventHandler(scene.canvas);
  

  eventHandler.setInputAction((movement: any) => {
      measure.handleClick(movement.position);
      const value = (measure as any).distance; 
      terria?.userProperties && (terria.userProperties.lastHeightMeters = value);
      closeBtn.textContent = i18next.t("sdkHeight.sdkHeightPluginDone");
      heightText.style.display = true;
      heightText.textContent = i18next.t("sdkHeight.sdkHeightPluginHeight") + value.toFixed(2) + " m";

      points._pointPrimitives.forEach((point: any) => {
        point.color = Color.WHITE;
        point.outlineColor = Color.DEEPSKYBLUE;
        point.outlineWidth = 2;
      });


      primitives._primitives.forEach((line: any) => {
        line.color = Color.WHITE;
        line.depthFailColor = Color.WHITE;
      });

      

  }, ScreenSpaceEventType.LEFT_CLICK);

    closeBtn?.addEventListener("click", () => {
        eventHandler.destroy(); // always clean up
        document.getElementById("center-note")?.remove();
        viewState.closeTool();
        primitives.removeAll();
        labels.removeAll();
        points.removeAll();
        return null;
    });

    useEffect(() => {
        return () => {
            eventHandler.destroy(); // always clean up
            document.getElementById("center-note")?.remove();
            primitives.removeAll();
            labels.removeAll();
            points.removeAll();
        };
    }, []);

    return null;
};


function showCenterNote(
  message: string,
  labelMessage: string
) {

  document.getElementById("center-note")?.remove();

  const note = document.createElement("div");
  note.id = "center-note";
  note.setAttribute("aria-hidden", "true");
  note.style.cssText = `
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100000;
    background: #ffffffff;
    color: #000000ff;
    padding: 12px 12px;
    border-radius: 1px;
    text-align: left;
    font-size: 16px;
    font-family: Inter, sans-serif;
    font-weight: 900;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    max-width: 400px;
    pointer-events: auto;
    display: flex;
    flex-direction: column; 
    align-items: left;
    gap: 10px; 
  `;
  note.textContent = message;

  heightText = document.createElement("label");
  heightText.style.cssText = `
    font-size: .9375rem;
    font-family: Inter, sans-serif;
    font-weight: 400;
  `;
  heightText.textContent = labelMessage;

  const normalBg = "#09315D";
  const hoverBg = "#3A587A";

  closeBtn = document.createElement("button");
      closeBtn.textContent = i18next.t("sdkHeight.sdkHeightPluginCancel");
      closeBtn.style.cssText = `
        border: none;
        background: ${normalBg};
        color: white;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: .9375rem;
        font-weight: 400;
        border-radius: 0px;
        box-shadow: none;
        height: 42px;
      `;

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = hoverBg;
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = normalBg;
  });

  document.body.appendChild(note);
  note.appendChild(heightText);
  note.appendChild(closeBtn);

}

