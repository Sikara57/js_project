var app = angular.module("myApp",['ngRoute','ngResource','angularMoment','ui.materialize','ngLodash']);

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
				controller:'boitier.ctrl',
				resolve:{
					liste:function(deviceFactory){
						return deviceFactory.query();
					}
				}
			})
			.when('/boitier/:id',{
				templateUrl:'client/views/myDevice.html',
				controller:'myDevice.ctrl',
				resolve:{
					liste:function(deviceFactory){
						return deviceFactory.query();
					}
				}
			})
			.otherwise({
				redirectTo:'/'
			})
}]);

app.filter('dateFr',['moment',function(moment){
	return function(date){
		return moment().format('LLL');
	}
}]);

app.config(['$resourceProvider',function($resourceProvider){
	$resourceProvider.defaults.stripTrailingSlshes = false;
}])