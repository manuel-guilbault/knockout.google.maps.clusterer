/*
*   knockout.google.maps.clusterer 0.1.0 (2014-01-12)
*   Created by Manuel Guilbault (https://github.com/manuel-guilbault)
*
*   Source: https://github.com/manuel-guilbault/knockout.google.maps.clusterer
*   MIT License: http://www.opensource.org/licenses/MIT
*/!function(a){"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?a(require("knockout"),exports):"function"==typeof define&&define.amd?define(["knockout","exports"],a):a(ko,ko.validation={})}(function(a){function b(b,d){var e=a.utils.unwrapObservable(b.clusterer)||c;return d[e]}if(void 0===typeof a.google.maps)throw"knockout.google.maps is required, please ensure it is loaded before loading this plugin";var c="$clusterer";a.bindingHandlers.clusterer={init:function(b,d,e,f,g){if(void 0===g.$map)throw"clusterer binding must be used only inside the scope of a map binding.";var h=a.utils.unwrapObservable(d()),i={};for(var j in a.bindingHandlers.clusterer.binders){var k=a.bindingHandlers.clusterer.binders[j];k.onBuildOptions&&k.onBuildOptions(g,h,i,a)}var l=new MarkerClusterer(g.$map,[],i);for(var j in a.bindingHandlers.clusterer.binders){var k=a.bindingHandlers.clusterer.binders[j];k.onCreated&&k.onCreated(g,h,l,a)}var m=a.utils.unwrapObservable(h.name)||c,n={};n[m]=l;var o=g.extend(n);return a.applyBindingsToDescendants(o,b),{controlsDescendantBindings:!0}},binders:{gridSize:{onBuildOptions:function(a,b,c,d){d.google.maps.utils.assignBindingToOptions(b,"gridSize",c,null)},onCreated:function(a,b,c,d){d.google.maps.utils.tryObserveBinding(b,"gridSize",function(a){c.setGridSize(a)})}},maxZoom:{onBuildOptions:function(a,b,c,d){d.google.maps.utils.assignBindingToOptions(b,"maxZoom",c,null)},onCreated:function(a,b,c,d){d.google.maps.utils.tryObserveBinding(b,"maxZoom",function(a){c.setMaxZoom(a)})}},styles:{onBuildOptions:function(a,b,c,d){d.google.maps.utils.assignBindingToOptions(b,"styles",c,null)},onCreated:function(a,b,c,d){d.google.maps.utils.tryObserveBinding(b,"styles",function(a){c.setStyles(a),c.resetViewport(),c.redraw()})}}}},a.virtualElements.allowedBindings.clusterer=!0,a.bindingHandlers.marker.binders.clusterer={onCreated:function(a,c,d){var e=b(c,a);e&&e.addMarker(d)},onRemoved:function(a,c,d,e){var f=b(c,a);f&&f.removeMarker(e)}}});