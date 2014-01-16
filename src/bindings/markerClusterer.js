(function () {
    var defaultClustererName = '$clusterer';

    ko.bindingHandlers.clusterer = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            if (bindingContext.$map === undefined) {
                throw 'clusterer binding must be used only inside the scope of a map binding.';
            }

            var bindings = ko.utils.unwrapObservable(valueAccessor());

            var options = ko.google.maps.binder.getCreateOptions(bindingContext, bindings, ko.bindingHandlers.clusterer.binders);
            var clusterer = new MarkerClusterer(bindingContext.$map, [], options);

            var subscriptions = new ko.google.maps.Subscriptions();
            ko.google.maps.binder.bind(bindingContext, bindings, clusterer, subscriptions, ko.bindingHandlers.clusterer.binders);

            var name = ko.utils.unwrapObservable(bindings.name) || defaultClustererName;
            var extension = {};
            extension[name] = clusterer;
            var childBindingContext = bindingContext.extend(extension);
            ko.applyBindingsToDescendants(childBindingContext, element);

            return { controlsDescendantBindings: true };
        },
        binders: {
            ignoreHidden: {
                createOptions: { name: 'ignoreHidden', type: 'bool' }
            },
            gridSize: {
                createOptions: 'gridSize',
                bindings: { name: 'gridSize', vmToObj: { setter: 'setGridSize' } }
            },
            maxZoom: {
                createOptions: 'maxZoom',
                bindings: { name: 'maxZoom', vmToObj: { setter: 'setMaxZoom' } }
            },
            styles: {
                createOptions: 'styles',
                bindings: {
                    name: 'styles',
                    vmToObj: {
                        setter: function (clusterer, styles) {
                            clusterer.setStyles(styles);
                            clusterer.resetViewport();
                            clusterer.redraw();
                        }
                    }
                }
            },
            calculator: {
                createOptions: 'calculator'
            }
        }
    };
    ko.virtualElements.allowedBindings.clusterer = true;

    function getClusterer(marker) {
        return ko.utils.domData.get(marker, 'clusterer');
    }

    function setClusterer(marker, newClusterer) {
        var oldClusterer = getClusterer(marker);
        if (oldClusterer) {
            oldClusterer.removeMarker(marker);
        }

        ko.utils.domData.set(marker, 'clusterer', newClusterer);
        if (newClusterer) {
            newClusterer.addMarker(marker);
        }
    }

    function removeClusterer(marker) {
        setClusterer(marker);
    }

    // Add a new binder to the marker binding to handle add and remove from clusterer.
    ko.bindingHandlers.marker.binders.clusterer = {
        bind: function (bindingContext, bindings, marker, subscriptions) {
            var clustererName = ko.utils.unwrapObservable(bindings.clusterer) || defaultClustererName;

            var clusterer = bindingContext[clustererName];
            if (clusterer) {
                setClusterer(marker, clusterer);
                subscriptions.add(function () {
                    removeClusterer(marker);
                });
            }

            if (ko.isObservable(bindings.clusterer)) {
                subscriptions.addKOSubscription(bindings.clusterer.subscribe(function (clustererName) {
                    if (!clustererName) return;

                    setClusterer(marker, bindingContext[clustererName]);
                }));
            }

            subscriptions.addGMListener(google.maps.event.addListener(marker, 'visible_changed', function () {
                var clusterer = getClusterer(marker);
                if (!clusterer) return;

                var needsRepaint = ko.utils.domData.get(clusterer, 'needsRepaint');
                if (needsRepaint) return; // Already flagged as needing repaint, so do nothing.

                ko.utils.domData.set(clusterer, 'needsRepaint', true);
                setTimeout(function () {
                    var clusterer = getClusterer(marker);
                    clusterer.repaint();
                    ko.utils.domData.set(clusterer, 'needsRepaint', false);
                }, 0);
            }));
        }
    };
})();