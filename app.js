'use strict';

var app = angular.module('app', [
	'ngRoute',
	'ngSanitize',
	'oc.lazyLoad'
])

.config(function($routeProvider, $httpProvider, $locationProvider, $ocLazyLoadProvider)
{
	moment.updateLocale('en', {
		relativeTime : {
			future: "en %s",
			past: "hace %s ",
			s: "unos segundos",
			m: "1 minuto",
			mm: "%d minutos",
			h: "1 hora",
			hh: "%d horas",
			d: "1 día",
			dd: "%d días",
			M: "1 mes",
			MM: "%d meses",
			y: "1 año",
			yy: "%d años"
		}
	})
	$httpProvider.defaults.withCredentials = true

	if (['localhost'].includes(window.location.hostname))
	{
		$locationProvider.html5Mode(true).hashPrefix('!')

		$routeProvider.when('/',
		{
			controller: 'Inicio',
			template: ''
		})
	}

	var requests = 0;

	function show()
	{
		requests++;

		if (requests === 1)
		{
			var loading = "<div class=\"process-loader\">";
			loading += "<svg class=\"circular\">";
			loading += "<circle class=\"path\" cx=\"60\" cy=\"60\" r=\"30\" fill=\"none\" stroke-width=\"4\" stroke-miterlimit=\"10\"/>";
			loading += "</svg>";
			loading += "</div>";
			$("#loader").html(loading);
			$(".loading").addClass("activo");
		}
	}

	function hide()
	{
		requests--;

		if (requests === 0)
		{
			$("#loader").html('');
			$(".loading").removeClass("activo");
		}
	}

	$httpProvider.interceptors.push(function($q)
	{
		return {

			'request': function(config)
			{

				if(config.shadow || typeof config.shadow == 'undefined')
				{
					show();
				}
				return $q.when(config);

			},

			'response': function(response)
			{
				hide();
				return $q.when(response);
			},

			'responseError': function(rejection)
			{
				alert("Error: No hay conexion");
				hide();
				return $q.reject(rejection);
			}
		};
	});
})

.directive('dwsModule', ['$compile', '$http', '$ocLazyLoad', function($compile, $http, $ocLazyLoad)
{
	return {
		restrict: 'A',
		link: function(scope, element, attrs)
		{
			if (attrs.dwsModule)
			{
				// console.log(attrs.$attr)
				var dwshtml = attrs.dwsModule.replace(/\./g, '_')
				var dwsId = attrs.dwsId ? attrs.dwsId : dwshtml
				var u = window.location.href
				var p = u.includes("https") ? "https://" : "http://"

				var params = {
					component: attrs.dwsModule
				}

				for (var key in attrs.$attr)
				{
					if (key != "dwsModule")
					{
						params[key] = attrs[key]
					}
				}

				var urlModuleBase = window.location.href + "modules/" + attrs.dwsModule

				scope[dwsId] = '<div class="dws-loader-component"></div>'

				$http.get(urlModuleBase + "/view.html",
				{
					params: params

				}).then(async function(response)
				{
					loadCSS(urlModuleBase + "/style.css")
					await $ocLazyLoad.load(urlModuleBase + "/script.js")

					scope.$apply(function()
					{
						scope[dwsId] = response.data
					})
				})
			}

			scope.$watch(function()
			{
				return scope.$eval(dwsId)

			}, function(value)
			{
				element.html(value)
				$compile(element.contents())(scope)
			})
		}
	}

}])

.controller('Inicio', function($scope, $routeParams)
{
})