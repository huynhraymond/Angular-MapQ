
var googleMapApp = angular.module('googleMapApp', []);

googleMapApp.controller('googleMapController', function($scope) {
    $scope.mapcity = '';
    $scope.mapcitywatch = undefined;

    $scope.getCity = function(event) {
        if ( event.keyCode === 13 ) {
            $scope.mapcitywatch = $scope.mapcity;
        }
    }
});

googleMapApp.directive('googlemap', function($q, $http) {
    var map;

    return {
        restrict: 'A',

        compile: function(element, attrs) {
            // make sure google map is the first to loaded
            var google_script_deferred = $q.defer();

            // callback() must be global
            window.initGoogleMapDirective = function() {
                //console.log('directive: ' + element);

                map = initGoogleMap(element);

                google_script_deferred.resolve();
            };

            loadGoogleScript("https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initGoogleMapDirective");

            return {
                pre: function() {},
                post: function( scope, element, attrs ) {
                    $q.all([google_script_deferred], function(result) {});

                    scope.$watch('mapcitywatch', function() {
                        if ( scope.mapcitywatch !== undefined ) {
                            //console.log('watch');
                            loadCityMap($http, map, scope.mapcitywatch);
                        }
                    });
                }
            }
        }
    }
});

// Download google map script and load it
function loadGoogleScript(url) {

    var script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}

function initGoogleMap( element ) {
    var map = new google.maps.Map(element[0], {
        zoom: 16,
        center: new google.maps.LatLng(10.762622, 106.660172)
    });

    return map;
}

function loadCityMap($http, map, city) {

    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(city);
    $http.get(url).success(function(data) {

        var coords = data.coord;

        var title = city + '\nWeather: ' + data.weather[0].main;

        var city_lat_lng = new google.maps.LatLng(coords.lat, coords.lon);
        new google.maps.Marker({
            position: city_lat_lng,
            map: map,
            title: title
        });

        map.setCenter(city_lat_lng);

    }).error(function() {

    });
}