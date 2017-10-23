app.controller('boitier.ctrl',function($scope, $rootScope, liste, deviceFactory){
	$scope.Devices = liste;
	$scope.usr = false;

 	$scope.show2 = function()
 	{
 		$scope.usr = !$scope.usr;
 	}

	$scope.overlay = function()
	{
		var element = angular.element('#sidenav-overlay');
		element.remove();
	}
});