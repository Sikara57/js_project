app.controller('myDevice.ctrl',function($scope, $routeParams,deviceFactory,deviceEventFactory,liste){
	$scope.Devices = liste;
	$scope.usr = false;
	$scope.visibilityEvent = false;
	$scope.visibilityChart = false;
	$scope.visibilityLight = false;
	var socket = io.connect('http://localhost:3000');
	$scope.errorEvent = '';
	$scope.errorChart = '';
	$scope.switchLight = '';

	$scope.myDevice = deviceFactory.get({deviceId:$routeParams.id});
	$scope.myDeviceEvent = deviceEventFactory.query();

 	$scope.show2 = function()
 	{
 		$scope.usr = !$scope.usr;
 	}

	$scope.overlay = function()
	{
		var element = angular.element('#sidenav-overlay');
		element.remove();
	}


	



	$scope.event = function()
	{
		$scope.visibilityEvent = !$scope.visibilityEvent;
		if($scope.myDeviceEvent=='')
		{
			$scope.errorEvent = 'Pas d\'event à afficher ';
		}
		else
		{
			$scope.errorEvent = '';
		}
	}



	$scope.light = function()
	{
		$scope.visibilityLight = !$scope.visibilityLight;

		var eventObjt = {
        "data": '',
        "ttl": '',
        "published_at": new Date(),
        "coreid": '',
        "name": 'Light',
		};

		deviceEventFactory.save({eventObjt}, function(data){

			console.log(data);
			if(data.data == '0')
			{
				$scope.switchLight = 'Lampe éteinte';
			}
			else if(data.data == '1')
			{
				$scope.switchLight = 'Lampe allumée';
			}
			else
			{
				$scope.switchLight = 'Erreur d\'allumage !';
			}
			
		});
	}

/* --------------------------------------------------------------------------------- */
/* ----------------------------------- Chart --------------------------------------- */
/* --------------------------------------------------------------------------------- */



	$scope.labels = [0];
	$scope.series = ['Intensity'];
	$scope.data = [0];

	$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
	$scope.options = {
	scales: {
	  yAxes: [
	    {
	      id: 'y-axis-1',
	      type: 'linear',
	      display: true,
	      position: 'left'
	    }
	  ]
	}
	};

	socket.on('Intensity',function(data){
		// console.log(data.data);
		var last_elem = $scope.labels[$scope.labels.length-1];
		$scope.labels.push(last_elem + 5);
		$scope.data.push(data.data);
		$scope.$apply();
	});

	$scope.chart = function()
	{
		$scope.visibilityChart = !$scope.visibilityChart;

		if($scope.labels[0] == '')
		{

			$scope.errorChart = 'Pas de relever d\'intensité à afficher ';
		}
		else
		{
			$scope.errorChart = '';
		}
	}
	
});