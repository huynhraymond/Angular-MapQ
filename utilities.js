
angular.module('utility', []).controller('UtilityController', function($scope) {

}).directive('local', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attribute) {

            var value = localStorage.getItem(attribute.name) || '';
            element.val(value);

            // write event listener on change to store the value of input element
            element[0].addEventListener('change', function() {
                localStorage.setItem(attribute.name, this.value);
            });
        }
    }
});

