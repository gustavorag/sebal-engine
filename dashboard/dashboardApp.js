var app = angular.module('schedulerDashboard', [
	'dashboardControllers',
	//'dashboardServices',
	'ngRoute'
	//'ui.bootstrap'
]);
app.constant("appConfig", {
	"urlSebalSchedulerService":"http://localhost:9192/sebal-scheduler/",
	"imageResourcePath":"image/:imgName",
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
	    templateUrl : '../index.html',
	    controller  : 'loginController'
	})
	.when('/main', {
	    templateUrl : 'monitor.html',
	    controller  : 'monitorController'
	})

	// route for the about page
	.when('/selectRegion', {
	    templateUrl : 'select_region.html',
	    controller  : 'regionController'
	})
	// route for the contact page
	.when('/submitRegion', {
	    templateUrl : 'select_region.html',
	    controller  : 'regionController'
	});
});

