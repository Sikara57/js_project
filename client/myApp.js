var app = angular.module("myApp",['ngRoute','ngResource','ui.materialize']);

app.config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider){
		$routeProvider
			.when('/',{
				templateUrl:'client/views/home.html',
				controller:'home.ctrl'
			})
			.otherwise({
				redirectTo:'/'
			})
}]);

app.config(['$resourceProvider',function($resourceProvider){
	$resourceProvider.defaults.stripTrailingSlshes = false;
}])