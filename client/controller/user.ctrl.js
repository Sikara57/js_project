app.controller('user.ctrl',function($scope,$routeParams,userFactory,users){

  $scope.monProfil = userFactory.get({userId:$routeParams.id});

  $scope.myUsers = users;

  $scope.usr=false;

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