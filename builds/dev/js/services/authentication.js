myApp.factory('Authentication', ['$firebaseAuth', '$firebaseObject', '$rootScope', '$location', function($firebaseAuth, $firebaseObject, $rootScope, $location) {

	// Creatr a reference to the firebase database
	var ref = firebase.database().ref();

	// Create an authentication method to firebase
	var auth = $firebaseAuth();

	// Create Authentication Object which handles logging in and out
	var authObj;

	auth.$onAuthStateChanged(function(authUser) {
		if(authUser) {
			// Get the currently logged in user from the database
			var userRef = ref.child('users').child(authUser.uid);

			// Firebase reference or Firebase Query and returns a JavaScript object which contains the data of the user.
			var userObj = $firebaseObject(userRef);

			$rootScope.currentUser = userObj;
		} else {
			$rootScope.currentUser = '';
		}
	});

	authObj = {

		login: function(user) {
			// Log into account with user details. 
			auth.$signInWithEmailAndPassword(
				user.email,
				user.password
			).then(function(user) {
				$location.path('/meetings');
			}).catch(function(error) {
				$rootScope.message = error.message;
			});  // signInWithEmailAndPassword 
		}, // Login

		logout: function() {
			// Sign out the user.
			return auth.$signOut();
		}, // Logout

		requireAuth: function() {
			// Force page on site to require a user to be logged in. 
			return auth.$requireSignIn();
		}, // require authentication

		register: function(user) {

			// Create a user in Firebase.
			auth.$createUserWithEmailAndPassword(
				user.email,
				user.password
			).then(function(regUser) {
				
				// Send additional information about user to firebase
				var regRef = ref.child('users').child(regUser.uid).set({
					date: firebase.database.ServerValue.TIMESTAMP,
					regUser: regUser.uid,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email
				});

				// Automatially Log in the user after registering.
				authObj.login(user);

			}).catch(function(error) {
				$rootScope.message = error.message;
			}); // CreateUserWithEmailandPassword

		} // Register

	} // AuthObj

	return authObj;

}]); // Factory