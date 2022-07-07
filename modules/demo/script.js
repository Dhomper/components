angular.module('app').controller('components.demo', function($scope, $rootScope, $http)
{
	$scope.saludo = ""
	$scope.init = function()
	{
		$scope.saludo = prompt('Nombre')
	}
})