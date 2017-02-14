var dashboardControllers = angular.module('dashboardControllers', []);

dashboardControllers.controller('mainController', function($scope, $log, $filter, $timeout, 
   $location, AuthenticationService, appConfig) {
  
  $scope.user = AuthenticationService.getUser();
  
  $scope.doLogout =  function(){
    console.log("Logout success");
    AuthenticationService.doLogout();
    $location.path('/');
  }
 
});

dashboardControllers.controller('loginController', function($scope, $log, $filter, $timeout,
  $location, appConfig, AuthenticationService) {
  
  $scope.username ;
  $scope.password ;

  $scope.doLogin = function(){
    $scope.errorMsg = '';
    AuthenticationService.mockLogin($scope.username, $scope.password,
      function(response){ //Success call back
        console.log("Login success");
        $location.path('/monitor');
      }, 
      function(response){ //Erro call back
        console.log("Login error: "+response);
        $scope.errorMsg = response;
      }
    );
  }
 
});

dashboardControllers.controller('monitorController', function($scope, $log, $filter, $timeout, 
  AuthenticationService, appConfig) {
  
  $scope.user = AuthenticationService.getUser();

 
});

dashboardControllers.controller('regionController', function($scope, $log, $filter, $timeout, 
  AuthenticationService, RegionService, appConfig) {

  $scope.user = AuthenticationService.getUser();

  $scope.submitRegion = function(){
    //Validate data
    RegionService.data = "firstYear="+$scope.firstYear
      +"&lastYear="+$scope.secondYear
      +"&region="+$scope.region
      +"&sebalVersion"+$scope.sebalVersion;
    console.log("Submiting "+JSON.stringify(RegionService.data));
    $scope.firstYear=undefined;
    $scope.secondYear=undefined;
    $scope.region=undefined;
  };
 
});

dashboardControllers.controller('mapController', function($scope, $log, $filter, $timeout, 
  AuthenticationService, RegionService, appConfig) {

  $scope.user = AuthenticationService.getUser();

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

