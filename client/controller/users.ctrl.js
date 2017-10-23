app.controller('users.ctrl',function($scope,users,userFactory){
	$scope.myUsers = users;
	$scope.expanded = false;
	$scope.usr = false;
	$scope.person = {};
	var monTableau = [];

	users.forEach(function(element){
		monTableau.push('element.nom');
	});


   $scope.ajoutUser = function(user,mode){
        if(mode==1)
        {
            console.log('Ajout');
            console.log(user);
            $scope.myUsers.push($scope.person);
            // console.log(eleve);
            userFactory.save({user});
            $scope.collapsibleElements[0].content.push($scope.person);
            $scope.person = {};
            $scope.expanded = false;
        }
        else
        {
            console.log('edit');
            // $scope.maListe.push($scope.person);
            console.log(eleve._id);
            useractory.update({userId:user._id},user);
            $scope.person={};
        }

    };

    $scope.deleteEleve = function(eleve,index){
        // console.log(eleve);
        eleveFactory.delete({userId:eleve._id});
        //permet de supprimer aussi l'affichage
        $scope.maListe.splice(index,1);
    };

    // Avec socket.io on fait un $scope.splice puis un $scope.$apply()

    $scope.updateEleve = function (eleve)
    {
        $scope.parametre.ajout=0;
        // console.log(eleve._id);
        $scope.person=eleve;
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
});