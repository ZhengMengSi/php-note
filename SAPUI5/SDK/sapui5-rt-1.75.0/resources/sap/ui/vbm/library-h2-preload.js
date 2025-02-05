//@ui5-bundle sap/ui/vbm/library-h2-preload.js
/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.predefine('sap/ui/vbm/library',['sap/ui/core/Core','sap/ui/core/library'],function(C,L){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.vbm",dependencies:["sap.ui.core"],types:["sap.ui.vbm.ClusterInfoType","sap.ui.vbm.SemanticType"],interfaces:[],controls:["sap.ui.vbm.AnalyticMap","sap.ui.vbm.GeoMap","sap.ui.vbm.VBI","sap.ui.vbm.Cluster","sap.ui.vbm.Viewport"],elements:["sap.ui.vbm.Area","sap.ui.vbm.Areas","sap.ui.vbm.Box","sap.ui.vbm.Boxes","sap.ui.vbm.Circle","sap.ui.vbm.Circles","sap.ui.vbm.Container","sap.ui.vbm.Containers","sap.ui.vbm.DragSource","sap.ui.vbm.DropTarget","sap.ui.vbm.Feature","sap.ui.vbm.FeatureCollection","sap.ui.vbm.GeoJsonLayer","sap.ui.vbm.GeoCircle","sap.ui.vbm.GeoCircles","sap.ui.vbm.Legend","sap.ui.vbm.LegendItem","sap.ui.vbm.Pie","sap.ui.vbm.PieItem","sap.ui.vbm.Pies","sap.ui.vbm.Region","sap.ui.vbm.Resource","sap.ui.vbm.Route","sap.ui.vbm.Routes","sap.ui.vbm.Spot","sap.ui.vbm.Spots","sap.ui.vbm.VoAggregation","sap.ui.vbm.VoBase","sap.ui.vbm.ClusterBase","sap.ui.vbm.ClusterTree","sap.ui.vbm.ClusterGrid","sap.ui.vbm.ClusterDistance","sap.ui.vbm.Heatmap","sap.ui.vbm.HeatPoint","sap.ui.vbm.ClusterContainer","sap.ui.vbm.Adapter","sap.ui.vbm.Adapter3D"],version:"1.75.0"});jQuery.sap.registerModuleShims({"sap/ui/vbm/adapter3d/thirdparty/three":{amd:true,exports:"THREE"},"sap/ui/vbm/adapter3d/thirdparty/ColladaLoader":{exports:"THREE.ColladaLoader",deps:["sap/ui/vbm/adapter3d/thirdparty/three"]},"sap/ui/vbm/adapter3d/thirdparty/OrbitControls":{exports:"THREE.OrbitControls",deps:["sap/ui/vbm/adapter3d/thirdparty/three"]},"sap/ui/vbm/adapter3d/thirdparty/DecalGeometry":{exports:"DecalGeometry",deps:["sap/ui/vbm/adapter3d/thirdparty/three"]},"sap/ui/vbm/adapter3d/thirdparty/html2canvas":{amd:true,exports:"html2canvas"}});sap.ui.vbm.SemanticType={None:"None",Error:"Error",Warning:"Warning",Success:"Success",Default:"Default",Inactive:"Inactive",Hidden:"Hidden"};sap.ui.vbm.ClusterInfoType={ContainedVOs:0,ChildCluster:1,ParentNode:2,NodeInfo:10,Edges:11};sap.ui.vbm.RouteType={Straight:"Straight",Geodesic:"Geodesic"};
sap.ui.vbm.getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.ui.vbm.i18n");};
sap.ui.vbm.findInArray=function(s,p){if(!Array.isArray(s)||typeof p!=="function"){return undefined;}for(var i=0,c=s.length;i<c;i++){var v=s[i];if(p(v)){return v;}}return undefined;};
sap.ui.vbm.findIndexInArray=function(s,p){if(!Array.isArray(s)||typeof p!=="function"){return-1;}for(var i=0,c=s.length;i<c;i++){var v=s[i];if(p(v)){return i;}}return-1;};
return sap.ui.vbm;},false);
sap.ui.require.preload({
	"sap/ui/vbm/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.vbm","type":"library","embeds":[],"applicationVersion":{"version":"1.75.0"},"title":"SAP UI library: sap.ui.vbm","description":"SAP UI library: sap.ui.vbm","ach":"CA-GTF-VBZ","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_plus","sap_bluecrystal","sap_fiori_3","sap_fiori_3_dark","sap_fiori_3_hcb","sap_fiori_3_hcw","sap_hcb","sap_mvi"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.75","libs":{"sap.ui.core":{"minVersion":"1.75.0"},"sap.ui.commons":{"minVersion":"1.75.0","lazy":true},"sap.ui.unified":{"minVersion":"1.75.0","lazy":true}}},"library":{"i18n":false,"content":{"controls":["sap.ui.vbm.AnalyticMap","sap.ui.vbm.GeoMap","sap.ui.vbm.VBI","sap.ui.vbm.Cluster","sap.ui.vbm.Viewport"],"elements":["sap.ui.vbm.Area","sap.ui.vbm.Areas","sap.ui.vbm.Box","sap.ui.vbm.Boxes","sap.ui.vbm.Circle","sap.ui.vbm.Circles","sap.ui.vbm.Container","sap.ui.vbm.Containers","sap.ui.vbm.DragSource","sap.ui.vbm.DropTarget","sap.ui.vbm.Feature","sap.ui.vbm.FeatureCollection","sap.ui.vbm.GeoJsonLayer","sap.ui.vbm.GeoCircle","sap.ui.vbm.GeoCircles","sap.ui.vbm.Legend","sap.ui.vbm.LegendItem","sap.ui.vbm.Pie","sap.ui.vbm.PieItem","sap.ui.vbm.Pies","sap.ui.vbm.Region","sap.ui.vbm.Resource","sap.ui.vbm.Route","sap.ui.vbm.Routes","sap.ui.vbm.Spot","sap.ui.vbm.Spots","sap.ui.vbm.VoAggregation","sap.ui.vbm.VoBase","sap.ui.vbm.ClusterBase","sap.ui.vbm.ClusterTree","sap.ui.vbm.ClusterGrid","sap.ui.vbm.ClusterDistance","sap.ui.vbm.Heatmap","sap.ui.vbm.HeatPoint","sap.ui.vbm.ClusterContainer","sap.ui.vbm.Adapter","sap.ui.vbm.Adapter3D"],"types":["sap.ui.vbm.ClusterInfoType","sap.ui.vbm.SemanticType"],"interfaces":[]}}}}'
},"sap/ui/vbm/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ui/vbm/Adapter.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Adapter3D.js":["jquery.sap.global.js","sap/m/Button.js","sap/m/HBox.js","sap/m/Image.js","sap/m/Link.js","sap/m/ResponsivePopover.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/base/ManagedObjectObserver.js","sap/ui/core/Element.js","sap/ui/unified/Menu.js","sap/ui/unified/MenuItem.js","sap/ui/vbm/Viewport.js","sap/ui/vbm/adapter3d/ObjectFactory.js","sap/ui/vbm/adapter3d/SceneBuilder.js","sap/ui/vbm/adapter3d/Utilities.js","sap/ui/vbm/adapter3d/VBIJSONParser.js","sap/ui/vbm/adapter3d/thirdparty/three.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/AnalyticMap.js":["sap/ui/core/theming/Parameters.js","sap/ui/vbm/GeoMap.js","sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/AnalyticMapRenderer.js":["sap/ui/vbm/GeoMapRenderer.js"],
"sap/ui/vbm/Area.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Areas.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Box.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Boxes.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Circle.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Circles.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Cluster.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/ClusterBase.js":["sap/ui/core/Element.js","sap/ui/core/theming/Parameters.js","sap/ui/vbm/ClusterContainer.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/ClusterContainer.js":["sap/ui/vbm/Container.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/ClusterDistance.js":["sap/ui/vbm/ClusterBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/ClusterGrid.js":["sap/ui/vbm/ClusterBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/ClusterTree.js":["sap/ui/vbm/ClusterBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Container.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Containers.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/DragSource.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/DropTarget.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Feature.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/FeatureCollection.js":["sap/ui/core/theming/Parameters.js","sap/ui/vbm/GeoJsonLayer.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/GeoCircle.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/GeoCircles.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/GeoJsonLayer.js":["sap/ui/core/Element.js","sap/ui/core/theming/Parameters.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/GeoMap.js":["sap/ui/vbm/VBI.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/GeoMapRenderer.js":["sap/ui/vbm/VBIRenderer.js"],
"sap/ui/vbm/HeatPoint.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Heatmap.js":["sap/ui/vbm/VoAbstract.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Legend.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/LegendItem.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Pie.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/PieItem.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Pies.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Region.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Resource.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Route.js":["sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Routes.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Spot.js":["sap/ui/core/theming/Parameters.js","sap/ui/vbm/VoBase.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Spots.js":["sap/ui/vbm/VoAggregation.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/VBI.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/core/RenderManager.js","sap/ui/vbm/lib/sapvbi.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/Viewport.js":["jquery.sap.global.js","sap/ui/core/Control.js","sap/ui/core/ResizeHandler.js","sap/ui/vbm/adapter3d/Utilities.js","sap/ui/vbm/adapter3d/thirdparty/OrbitControls.js","sap/ui/vbm/adapter3d/thirdparty/three.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/ViewportRenderer.js":["jquery.sap.global.js"],
"sap/ui/vbm/VoAbstract.js":["sap/ui/core/Element.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/VoAggregation.js":["sap/ui/vbm/VoAbstract.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/VoBase.js":["sap/ui/core/Element.js","sap/ui/core/theming/Parameters.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/adapter3d/ObjectFactory.js":["sap/ui/base/Object.js"],
"sap/ui/vbm/adapter3d/SceneBuilder.js":["jquery.sap.global.js","sap/ui/base/Object.js","sap/ui/vbm/adapter3d/Utilities.js","sap/ui/vbm/adapter3d/thirdparty/ColladaLoader.js","sap/ui/vbm/adapter3d/thirdparty/DecalGeometry.js","sap/ui/vbm/adapter3d/thirdparty/html2canvas.js","sap/ui/vbm/adapter3d/thirdparty/three.js"],
"sap/ui/vbm/adapter3d/Utilities.js":["jquery.sap.global.js","sap/ui/base/Object.js","sap/ui/vbm/adapter3d/thirdparty/three.js"],
"sap/ui/vbm/adapter3d/VBIJSONParser.js":["jquery.sap.global.js","sap/ui/base/Object.js","sap/ui/vbm/adapter3d/ObjectFactory.js","sap/ui/vbm/library.js"],
"sap/ui/vbm/lib/sapvbi.js":["sap/ui/core/IconPool.js","sap/ui/core/theming/Parameters.js","sap/ui/vbm/lib/sapactions.js","sap/ui/vbm/lib/sapautomations.js","sap/ui/vbm/lib/sapconfig.js","sap/ui/vbm/lib/sapdataprovider.js","sap/ui/vbm/lib/sapevents.js","sap/ui/vbm/lib/sapgeolocation.js","sap/ui/vbm/lib/sapgeomath.js","sap/ui/vbm/lib/sapgeotool.js","sap/ui/vbm/lib/saplabels.js","sap/ui/vbm/lib/saplassotrack.js","sap/ui/vbm/lib/sapmaplayer.js","sap/ui/vbm/lib/sapmapmanager.js","sap/ui/vbm/lib/sapmapprovider.js","sap/ui/vbm/lib/sapnavigation.js","sap/ui/vbm/lib/sapparsing.js","sap/ui/vbm/lib/sappositioning.js","sap/ui/vbm/lib/sapprojection.js","sap/ui/vbm/lib/saprecttrack.js","sap/ui/vbm/lib/sapresources.js","sap/ui/vbm/lib/sapscale.js","sap/ui/vbm/lib/sapscene.js","sap/ui/vbm/lib/saputilities.js","sap/ui/vbm/lib/sapvbcluster.js","sap/ui/vbm/lib/sapvbicontext.js","sap/ui/vbm/lib/sapvbmenu.js","sap/ui/vbm/lib/sapvobase.js","sap/ui/vbm/lib/sapvoutils.js","sap/ui/vbm/lib/sapwindow.js"],
"sap/ui/vbm/library.js":["sap/ui/core/Core.js","sap/ui/core/library.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map