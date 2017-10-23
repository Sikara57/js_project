
app.factory('deviceFactory', function($resource){
	return $resource('http://localhost:3000/boitier/:deviceId',{deviceId:'@id'},
	{
		update:
		{
			method : 'PUT'
		}
	});
});