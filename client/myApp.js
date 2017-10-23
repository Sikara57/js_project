var app = angular.module("myApp",['ngRoute','ngResource','ui.materialize','ngLodash']);

app.config(['$routeProvider','$locationProvider',
	function($routeProvider,$locationProvider){
		$routeProvider
			.when('/',{
				templateUrl:'client/views/home.html',
				controller:'home.ctrl'
			})
			.when('/users',{
				templateUrl:'client/views/users.html',
				controller:'users.ctrl',
				resolve:{
					users:function(userFactory){
						return userFactory.query();
					}
				}
			})
			.when('/users/:id',{
				templateUrl:'client/views/user.html',
				controller:'user.ctrl',
				resolve:{
					users:function(userFactory){
						return userFactory.query();
					}
				}
			})
			.when('/boitier',{
				templateUrl:'client/views/boitier.html',
				controller:'boitier.ctrl'
			})
			.otherwise({
				redirectTo:'/'
			})
}]);

app.config(['$resourceProvider',function($resourceProvider){
	$resourceProvider.defaults.stripTrailingSlshes = false;
}])