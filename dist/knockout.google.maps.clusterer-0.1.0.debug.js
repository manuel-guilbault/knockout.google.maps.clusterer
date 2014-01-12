/*
*   knockout.google.maps.clusterer 0.1.0 (2014-01-12)
*   Created by Manuel Guilbault (https://github.com/manuel-guilbault)
*
*   Source: https://github.com/manuel-guilbault/knockout.google.maps.clusterer
*   MIT License: http://www.opensource.org/licenses/MIT
*/
(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define.amd) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.validation = {});
    }
}(function ( ko, exports ) {
    if (typeof (ko.google.maps) === undefined) { throw "knockout.google.maps is required, please ensure it is loaded before loading this plugin"; }
var defaultClustererName = '$clusterer';

function getClusterer(bindings, bindingContext) {
    var name = ko.utils.unwrapObservable(bindings.clusterer) || defaultClustererName;
    return bindingContext[name];
}

ko.bindingHandlers.clusterer = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (bindingContext.$map === undefined) {
            throw 'clusterer binding must be used only inside the scope of a map binding.';
        }

        var bindings = ko.utils.unwrapObservable(valueAccessor());

        var options = {};
        for (var property in ko.bindingHandlers.clusterer.binders) {
            var binder = ko.bindingHandlers.clusterer.binders[property];
            if (binder.onBuildOptions) {
                binder.onBuildOptions(bindingContext, bindings, options, ko);
            }
        }

        var clusterer = new MarkerClusterer(bindingContext.$map, [], options);
        for (var property in ko.bindingHandlers.clusterer.binders) {
            var binder = ko.bindingHandlers.clusterer.binders[property];
            if (binder.onCreated) {
                binder.onCreated(bindingContext, bindings, clusterer, ko);
            }
        }

        var name = ko.utils.unwrapObservable(bindings.name) || defaultClustererName;

        var extension = {};
        extension[name] = clusterer;
        var innerBindingContext = bindingContext.extend(extension);
        ko.applyBindingsToDescendants(innerBindingContext, element);

        return { controlsDescendantBindings: true };
    },
    binders: {
        ignoreHidden: {
            onBuildOptions: function (bindingContext, bindings, options, ko) {
                ko.google.maps.utils.assignBindingToOptions(bindings, 'ignoreHidden', options, null);
            }
        },
        gridSize: {
            onBuildOptions: function (bindingContext, bindings, options, ko) {
                ko.google.maps.utils.assignBindingToOptions(bindings, 'gridSize', options, null);
            },
            onCreated: function (bindingContext, bindings, clusterer, ko) {
                ko.google.maps.utils.tryObserveBinding(bindings, 'gridSize', function (v) { clusterer.setGridSize(v); });
            }
        },
        maxZoom: {
            onBuildOptions: function (bindingContext, bindings, options, ko) {
                ko.google.maps.utils.assignBindingToOptions(bindings, 'maxZoom', options, null);
            },
            onCreated: function (bindingContext, bindings, clusterer, ko) {
                ko.google.maps.utils.tryObserveBinding(bindings, 'maxZoom', function (v) { clusterer.setMaxZoom(v); });
            }
        },
        styles: {
            onBuildOptions: function (bindingContext, bindings, options, ko) {
                ko.google.maps.utils.assignBindingToOptions(bindings, 'styles', options, null);
            },
            onCreated: function (bindingContext, bindings, clusterer, ko) {
                ko.google.maps.utils.tryObserveBinding(bindings, 'styles', function (v) {
                    clusterer.setStyles(v);
                    clusterer.resetViewport();
                    clusterer.redraw();
                });
            }
        },
        calculator: {
            onBuildOptions: function (bindingContext, bindings, options, ko) {
                ko.google.maps.utils.assignBindingToOptions(bindings, 'calculator', options, null);
            }
        }
    }
};
ko.virtualElements.allowedBindings.clusterer = true;

ko.bindingHandlers.marker.binders.clusterer = {
    onCreated: function (bindingContext, bindings, marker, ko) {
        var clusterer = getClusterer(bindings, bindingContext);
        if (clusterer) {
            clusterer.addMarker(marker);
        }
    },
    onRemoved: function (bindingContext, bindings, viewModel, marker, ko) {
        var clusterer = getClusterer(bindings, bindingContext);
        if (clusterer) {
            clusterer.removeMarker(marker);
        }
    }
};
}));