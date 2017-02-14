var app = angular.module('schedulerDashboard', [
	'dashboardControllers',
	'dashboardServices',
	'ngRoute'
	//'ui.bootstrap'
]);
app.constant("appConfig", {
	"urlSebalSchedulerService":"http://localhost:9192/sebal-scheduler/",
	"authenticationPath":"auth/:authToken",
	"taskResourcePath":"task/:taskId/:varType",
	"dbImageResourcePath":"fetcher/image/",
	"filterResourcePath":"fetcher/filter/:filter"
});
app.config(function($logProvider){
  $logProvider.debugEnabled(true);
});
app.config(function($routeProvider){
	$routeProvider
	// route for the home page
	.when('/', {
	    templateUrl : '/pages/login.html',
	})
	.when('/monitor', {
	    templateUrl : '/pages/monitor.html',
	})
	.when('/selectRegion', {
	    templateUrl : '/pages/select_region.html',
	})
	.otherwise({
        redirectTo: '/'
     });
});

