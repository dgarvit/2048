(function() {

	angular.module('twoZeroFourEight', ['Game','Grid'])
	.controller('GameController', function(GameManager) {
		this.game = GameManager;
	});

	angular.module('Game', [])
	.service('GameManager', function() {

	});

	angular.module('Grid', [])
	.service('GridService', function() {
		this.grid = [];
		this.tiles = [];

		this.size = 4;
	})
	.directive('grid', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				ngModel: '='
			},
			templateUrl: '/static/html/grid.html'
		};
	});

})();