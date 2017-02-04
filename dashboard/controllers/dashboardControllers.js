var dashboardControllers = angular.module('dashboardControllers', []);

dashboardControllers.controller('loginController', function($scope, $log, $filter, $timeout, appConfig) {
  //Resposable for monitoring sebal tasks.
  $scope.message = '';
 
});

dashboardControllers.controller('monitorController', function($scope, $log, $filter, $timeout, appConfig) {
	$scope.message = 'Monitor Page';
 
});

dashboardControllers.controller('regionController', function($scope, $log, $filter, $timeout, appConfig) {
  $scope.message = ' --- ';

  function callbackSelectionInfo(selectionInfo){
    $scope.message = 'Selection: '+JSON.stringify(selectionInfo);
    $scope.$apply(); //This is for apply the modification avbove, that is made by callback.
    if(selectionInfo.quaresSelected > 4) {
      alert('Invalid selection!! You can\'t select more than 4 regions on the grid.');
    }else{
      alert('Selection at :'+JSON.stringify(selectionInfo));
    }
    

  };

  initiateMap("map", callbackSelectionInfo);
 
});