import cubeIcon from "assets/icons/heightIconFinal.svg";
import {
  CatalogMemberFactory,
  MapToolbar,
  TerriaPlugin,
  TerriaPluginContext
} from "terriajs-plugin-api";

export const toolId = "heightsdk";

const plugin: TerriaPlugin = {
  name: "pointheightmeasuresdk",
  description:
    "A plugin that allows you to create a twopointmeasure.",
  version: "0.0.1",
  register({ viewState }: TerriaPluginContext) {
    // Register our custom catalog item with Terria

    console.log("POINT HEIGHT PLUGIN LOADED");

    // Add a new tool to the map toolbar (on the right) for drawing a 3D box on the map.
    MapToolbar.addTool(viewState, {
      id: toolId,
      name: "translate#sdkHeight.sdkHeightPluginName",
      // The main react component for the tool
      toolComponentLoader: () => import("./Views/Main"),
      toolButton: {
        text: "translate#sdkHeight.sdkHeightPlugin",
        icon: cubeIcon,
        tooltip: "translate#sdkHeight.sdkHeightPluginTooltip"
      },
      title: "高さを計測する",
      viewerMode: "cesium"
    });
    
  }
};

export default plugin;
