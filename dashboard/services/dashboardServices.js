var dashboardServices = angular.module('dashboardServices', ['ngResource']);

dashboardServices.service('AuthenticationService', function($log, $resource, Session, appConfig) {
	var resourceUrl = appConfig.urlSebalSchedulerService+appConfig.authenticationPath;
	$log.debug("Creating resource to Sebal Authentication : "+resourceUrl+" --- Sessao: "+JSON.stringify(Session));
  	
  	var authService = {};

  	authService.auth = function (username, password, callbackSuccess, callbackError) {

  			//Implement clientside encriptography ??

  			user = {name: username, pass: password};

    		$http.post(resourceUrl, { username: username, password: password })
               .success(function (response) {
                   callbackSuccess(response)
                })
               .error(function (response) {
                   callbackError(response);
            	});

    };

  	authService.mockLogin = function (username, password, callbackSuccess, callbackError) {

		if(!username || !password){
			Session.destroy();
			callbackError("Username and Password are required");
		}else{
			Session.create(username, password);
			callbackSuccess("success");
		}

    };

    authService.doLogout = function(){
    	 Session.destroy();
    };

    authService.getUser = function(){
   		return Session.getUser();
    };

    return authService;
	
});

dashboardServices.service('Session', function () {
  this.create = function (userName, userPass) {
  	console.log('Creating user ')
  	this.user = {
    	name: userName,
    	pass: userPass
    };
  };
  this.destroy = function () {
    this.user = null;
  };
  this.getUser = function(){
  	return this.user;
  };
})


dashboardServices.service('RegionService', function($log, $resource, appConfig) {

	var resourceUrl = appConfig.urlSebalSchedulerService+appConfig.regionPath;

	return $resource(resourceUrl, null,
           {
	       		postRegion:{
	       			method: 'POST',
	               	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	       		}
           	}
	);
});
