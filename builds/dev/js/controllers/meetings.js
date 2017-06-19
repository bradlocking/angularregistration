myApp.controller('MeetingsController', ['$scope', '$firebaseAuth', '$firebaseArray', '$rootScope', 
function($scope, $firebaseAuth, $firebaseArray, $rootScope) {

	// Creatr a reference to the firebase database
	var ref = firebase.database().ref();

	// Create an authentication method to firebase
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(authUser) {
		if(authUser) {
			// Get the currently logged in user from the database
			var meetingsRef = ref.child('users').child(authUser.uid).child('meetings');

			// Store a copy of the meetings for the logged in user into a firebase array.
			var meetingsInfo = $firebaseArray(meetingsRef);

			// Store firebase meetings in local var
			$scope.meetings = meetingsInfo;

			meetingsInfo.$loaded().then(function(data) {
				// Get the total length of the meetings for the user. 
				$rootScope.howManyMeetings = meetingsInfo.length;
			}); // make sute the meeting data is loaded

			meetingsInfo.$watch(function(data) {
				$rootScope.howManyMeetings = meetingsInfo.length;
			});

			$scope.addMeeting = function() {
				meetingsInfo.$add({
					name: $scope.meetingname,
					date: firebase.database.ServerValue.TIMESTAMP
				}).then(function() {
					$scope.meetingname = '';
				}); // Promise
			}; // Addmeeting

			$scope.deleteMeeting = function(key) {
				meetingsInfo.$remove(key);
			} // Delete Meeting

		} // authUser
	});	// auth.$onAuthStateChanged

}]); // myApp.controller