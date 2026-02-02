# Terria Map Plugin for height measure using Cesium SDK function

This plugin has been done in order to work for the last version they have in TerriaMap (https://github.com/TerriaJS/TerriaMap) and TerriaJS (https://github.com/TerriaJS/terriajs)

You will need the cesiumgs-ion-sdk-measurements-6.0.0, and unpack it in the terriamap/packages folder.


We need to add this line as dependency in packages.json for TerriaMAP, that points to the sdk inside packages folder:

packages.json

CHOOSE THE NAME OF THE FOLDER FOR THE SDK

    "@cesiumgs/ion-sdk-measurements": "file:./packages/cesiumgs-ion-sdk-measurements-6.0.0/package",

And this in the dependencies:

    "terriajs-plugin-api": "0.0.1-alpha.17",
    "terriajs-plugin-pointheightsdk": "0.0.1-alpha.8"

and this in the workspace/package:

    "packages/TerriaPluginCesiumSdkHeightMeasure


plugin.ts

then this in the plugin.ts file from terriaMap:

    import("terriajs-plugin-pointheightsdk"),   



Then go to the plugin folder and:

    yarn install

    yarn build



----------------------

MAYBE THIS IS NOT NEEDED, JUST IN CASE WE GET SOME ERROR I PUT THIS HERE

    npm i -D @babel/core babel-loader @babel/preset-env @babel/preset-typescript  @babel/plugin-proposal-class-properties   @babel/plugin-proposal-private-methods   @babel/plugin-proposal-private-property-in-object   @babel/plugin-proposal-optional-chaining   @babel/plugin-proposal-nullish-coalescing-operator --legacy-peer-deps  --ignore-scripts

*****************************************************
**** IF problems arrived when launching, run the next commands:

rm -rf node_modules/terriajs/node_modules/terriajs-cesium

yarn gulp sync-terriajs-dependencies