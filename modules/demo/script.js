angular.module('app').controller('components.demo', function($scope, $rootScope, $http)
{
	/// VAR

	$scope.puestos = []
	$scope.saludo = ""

	/// FN

	$scope.init = function()
	{
		$scope.saludo = prompt('Nombre')
		$scope.listarPuestos()
	}

	/// API

	$scope.listarPuestos = function()
	{
		$http.get(DWS.getURL("empleos/v1/puestos"),
		{
			params:
			{
			}

		}).then(function(api)
		{
			$scope.puestos = api.data.response
		})
	}
})