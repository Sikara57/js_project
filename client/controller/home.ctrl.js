app.controller('home.ctrl',function($scope){
	$scope.overlay = function()
	{
		var element = angular.element('#sidenav-overlay');
		element.remove();
	}
});