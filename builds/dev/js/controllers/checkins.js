myApp.controller('CheckInsController', ['$scope', '$rootScope', '$location', '$routeParams', '$firebaseObject', '$firebaseArray', 
function($scope, $rootScope, $location, $routeParams, $firebaseObject, $firebaseArray) {

	// Empty var to be used for reference to db
	var ref, checkinsList;

	$rootScope.message = '';
	$scope.whichMeeting = $routeParams.mId;
	$scope.whichUser = $routeParams.uId;

	ref = firebase.database().ref()
			.child('users').child($scope.whichUser)
			.child('meetings').child($scope.whichMeeting)
			.child('checkins');

	var checkinsList = $firebaseArray(ref);
	$scope.checkins = checkinsList;

	// Set up search form field default values. 
	$scope.order = 'firstname';
	$scope.direction = null;
	$scope.query = '';
	$scope.recordId = '';

	$scope.pickRandom = function() {
		var whichRecord = Math.round(Math.random() * (checkinsList.length - 1));

		$scope.recordId = checkinsList.$keyAt(whichRecord);
	}; // Pick a random winner

	$scope.showLove = function(myCheckin) {
		myCheckin.show = !myCheckin.show;
		myCheckin.userState = myCheckin.show ? 'expanded' : '';
	};

	$scope.giveLove = function(myCheckin, myGift) {
		var refLove = ref.child(myCheckin.$id).child('awards');
		var checkinsArray = $firebaseArray(refLove);

		checkinsArray.$add({
			name: myGift,
			date: firebase.database.ServerValue.TIMESTAMP
		}).then(function() {
			$rootScope.message = 'Award added successfully';
		}).catch(function(error) {
			$rootScope.message = 'Award unable to be added at this time.';
			console.log(error);
		});
	}; // GiveLove

	$scope.deleteLove = function(myCheckin, awardKey) {
		var refLove = ref.child(myCheckin.$id).child('awards').child(awardKey);
		var record = $firebaseObject(refLove);

		// Remove clicked record
		record.$remove(awardKey);
	}; // deleteLove

	$scope.addCheckins = function() {
		checkinsList.$add({
			firstname: $scope.user.firstName,
			lastname: $scope.user.lastName,
			email: $scope.user.email,
			date: firebase.database.ServerValue.TIMESTAMP
		}).then(function() {
			$location.path('/checkins/' + $scope.whichUser + '/' + $scope.whichMeeting + '/checkinsList');
		}); // Add
	}; // Add Checkin Ins

	$scope.deleteCheckin = function(id) {
		var refDelete = ref.child(id),
			record    = $firebaseObject(refDelete);

		record.$remove(id).then(function() {
			$rootScope.message = 'Checkin Deleted Successfully';
		}).catch(function() {
			$rootScope.message = 'Checkin unable to be deleted';
		}); // Delete Checkin Message
	}; // Delete Checkin


}]); // myApp.controller