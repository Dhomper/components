angular.module('app').controller('components.f11', function($scope, $rootScope, $http)
{
	/// VAR

	$scope.puestos = []
	$scope.saludo = ""

	/// FN

	$scope.init = function()
	{
		$scope.reporte911()
	}

	/// API

	$scope.reporte911 = function()
	{
		$http.get(DWS.getURL("escolares/v1/alumnos/reporte911"),
		{
			params:
			{
				escuela_id: 3
			}

		}).then(function(api)
		{
			$scope.reporte = api.data.response
		})
	}
})