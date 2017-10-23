app.factory('userFactory', function($resource){
    return $resource('http://localhost:3000/users/:userId',{userId:'@id'},
    {
        update:
        {
            method: 'PUT'
        }
    });
});