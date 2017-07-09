(function() {

	angular.module('twoZeroFourEight', ['Game','Grid'])
	.controller('GameController', ['GameManager', function(a) {
		this.game = a;
		this.game.start();
	}]);

	angular.module('Game', ['Grid'])
	.service('GameManager', ['GridService' ,function(a) {
		this.grid = a.grid;
		this.tiles = a.tiles;
		this.start = function() {
			a.buildEmptyBoard();
		};
	}]);

	angular.module('Grid', [])
	.factory('TileModel', function() {
		var Tile = function(pos, val) {
			this.x = pos.x;
			this.y = pos.y;
			this.value = val || 2;
		};

		return Tile;
	})
	.service('GridService', ['TileModel' , function(a) {
		this.grid = [null];
		this.tiles = [];
		this.size = 4;
		var a = this;
		this.buildEmptyBoard = function() {
			for (var x = 0; x < a.size * a.size; x++) {
				this.grid[x] = null;
			}
		};
	}])
	.directive('grid', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				ngModel: '='
			},
			templateUrl: '/static/html/grid.html'
		};
	})
	.directive('tile', function() {
		return {
			restrict: 'A',
			scope: {
				ngModel: '='
			},
			templateUrl: '/static/html/tile.html'
		};
	});
	

})();