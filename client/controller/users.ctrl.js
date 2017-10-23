app.controller('users.ctrl',function($scope,users,userFactory,lodash){
	$scope.myUsers = users;
	$scope.expanded = false;
	$scope.usr = false;
	$scope.person = {};

	var socket = io.connect('http://localhost:3000');

   $scope.ajoutUser = function(user,mode){
        if(mode==1)
        {
            console.log('Ajout');
            console.log(user);
            userFactory.save({user});
            $scope.person = {};
            $scope.show();
        }
        else
        {
            console.log('edit');
            // $scope.maListe.push($scope.person);
            console.log(user._id);
            userFactory.update({userId:user._id},user);
            $scope.show();
        }

    };

    socket.on("userCreate",function(socket){

          $scope.myUsers.push(socket);
          $scope.$apply();
   	});

    socket.on("userUpdate",function(socket){
          // console.log(socket);
          // console.log($scope.myUsers);
          var index = lodash.findIndex($scope.myUsers, function(o) { return o._id == socket._id; });
          // var index = $scope.maliste.indexOf(socket);
          // console.log(index);
          $scope.myUsers.splice(index, 1,socket);
          $scope.$apply();
          $scope.show();
   	});


    $scope.deleteUser = function(user,index){
        // console.log(eleve);
        userFactory.delete({userId:user._id});
        //permet de supprimer aussi l'affichage
        $scope.show();
    };

    socket.on("userDelete",function(socket){
          // console.log(socket);
          // console.log($scope.myUsers);
          var index = lodash.findIndex($scope.myUsers, function(o) { return o._id == socket._id; });
          // var index = $scope.maliste.indexOf(socket);
          // console.log(index);
          $scope.myUsers.splice(index, 1);
          $scope.$apply();
   	});
    // Avec socket.io on fait un $scope.splice puis un $scope.$apply()

    $scope.updateUser = function (usr)
    {
    	$scope.show();
    	$scope.parametre.ajout=0;
        $scope.person=usr;
    }

 	$scope.show = function()
 	{
 		$scope.expanded = !$scope.expanded;
 		$scope.person = {};

 	}

 	$scope.show2 = function()
 	{
 		$scope.usr = !$scope.usr;
 		$scope.person = {};

 	}

  $scope.overlay = function()
  {
    var element = angular.element('#sidenav-overlay');
    element.remove();
  }

});