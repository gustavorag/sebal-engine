var dashboardServices = angular.module('dashboardServices', ['ngResource']);

dashboardServices.service('AuthenticationService', function($log, $http,
  Session, appConfig) {

	var resourceUrl = appConfig.urlSebalSchedulerService+appConfig.authenticationPath;
	var authService = {};

	authService.auth = function (username, password, callbackSuccess, callbackError) {

			//Implement clientside encriptography ??
      //LOGIN_SUCCEED, LOGIN_FAILED, LOGOUT_SUCCEED
			user = {'name': username, 'pass': password};
      
      
  		$http.post(resourceUrl, user)
             .success(function (response) {
                console.log("Return: "+JSON.stringify(response));
                var authToken = "TOKEN-SEBAL" // fix this hardcode to get token from HEADERS
                Session.create(username, authToken);
                callbackSuccess(response)
             }).
             error(function (error) {
                 callbackError(error);
          	 });

      // $http({
      //     method: 'GET',
      //     url: resourceUrl,
      //     data: {'message': 'Hello world'}
      // })
      // .success(function (response) {
      //     var authToken = "TOKEN-SEBAL" // fix this hardcode to get token from HEADERS
      //     Session.create(username, authToken);
      //     callbackSuccess(response);
      // })
      // .error(function (error) {
      //   callbackError(error);
      // });
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

  authService.getUserName = function(){
 		return Session.getUser().name;
  };

  authService.getToken = function(){
    return Session.getUser().token;
  };

  return authService;
	
});

dashboardServices.service('Session', function () {
  
  this.user = {
      name: undefined,
      token: undefined
  };

  this.create = function (userName, userToken) {
  	console.log('Creating user ')
  	this.user = {
    	name: userName,
    	token: userToken
    };
  };
  this.destroy = function () {
    this.user = {
      name: undefined,
      token: undefined
    };
  };
  this.getUser = function(){
  	return this.user;
  };
})

dashboardServices.service('GlobalMsgService', function () {

  var message;
  this.cleanMsg = function() {
    message = {content: undefined, level: undefined}
  };

  this.cleanMsg();

  this.pushMessageAlert = function (msg) {
    message.content = msg;
    message.level = "alert-info";
  };
  this.pushMessageSuccess = function (msg) {
    message.content = msg;
    message.level = "alert-success";
  };
  this.pushMessageInfo = function (msg) {
    message.content = msg;
    message.level = "alert-info";
  };
  this.pushMessageWarning = function (msg) {
    message.content = msg;
    message.level = "alert-warning";
  };
  this.pushMessageFail = function (msg) {
    message.content = msg;
    message.level = "alert-danger";
  };
  this.getContent = function(){
    return message.content;
  } 
  this.getLevel = function(){
    return message.level;
  }

})

dashboardServices.service('ImageService', function($log, $http, AuthenticationService, appConfig) {

  var resourceUrl = appConfig.urlSebalSchedulerService+appConfig.imagePath;
  var sessionToken = AuthenticationService.getToken();

  var imageService = {};

  imageService.getImages = function(successCallback, errorCalback){
    $http.get(resourceUrl, {headers: { 'x-auth-token': sessionToken} })
      .success(successCallback).error(errorCalback);
      
  };

  return imageService;
  
});

dashboardServices.service('RegionService', function($log, $resource, AuthenticationService, appConfig) {

	var resourceUrl = appConfig.urlSebalSchedulerService+appConfig.regionPath;
  var sessionToken = AuthenticationService.getToken();
	return $resource(resourceUrl, null,{
            get: {
              method: 'GET',
              headers: {'auth-token': sessionToken}
            }
          }
  );
});
