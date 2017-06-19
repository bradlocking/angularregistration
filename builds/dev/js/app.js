var myApp = angular.module('myApp', ['ngRoute', 'firebase']);

myApp.run(['$rootScope', '$location', function($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
		// We can catch the error thrown when the $requireSignIn promise is rejected
		// and redirect the user back to the home page
		if (error === "AUTH_REQUIRED") {
			$rootScope.message = 'Sorry, you must log in to view that page';
			$location.path("/login");
		} // Auth Required
	}); // Route Change Error
}]) // Run

myApp.config(['$routeProvider', function($routeProvider, $firebase, $firebaseAuth) {
 
	$routeProvider.

		when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegistrationController'
		}).

		when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegistrationController'
		}).

		when('/checkins/:uId/:mId', {
			templateUrl: 'views/checkins.html',
			controller: 'CheckInsController'
		}).

		when('/checkins/:uId/:mId/checkinsList', {
			templateUrl: 'views/checkinsList.html',
			controller: 'CheckInsController'
		}).

		when('/meetings', {
			templateUrl: 'views/meetings.html',
			controller: 'MeetingsController',
			resolve: {
				currentAuth: function(Authentication) {
					return Authentication.requireAuth();
				} // CurrentAuth
			} // Resolve
		}).

		otherwise({
			redirectTo: '/login'
		});

}])