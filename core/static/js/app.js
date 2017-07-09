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
			a.build();
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
	.service('GridService', ['TileModel' , function(TileModel) {
		this.grid = [null];
		this.tiles = [];
		this.size = 4;
		var a = this;

		this.withinGrid = function(pos) {
			return pos.x >=0 && pos.y >=0 && pos.x < a.size && pos.y < a.size;
		};

		this.get = function(pos) {
			if(this.withinGrid(pos)) {
				var i = (pos.y * a.size) + pos.x;
				return this.tiles[i];
			}
			else {
				return null;
			}
		};

		this.set = function(pos, tile) {
			if (this.withinGrid(pos)) {
				var i = (pos.y * a.size) + pos.x;
				this.tiles[i] = tile;
			}
		};

		this.availableCells = function() {
			var cells = [];
			for (var i = 0; i < a.size; i++) {
				for (var j = 0; j < a.size; j++) {
					var b = a.get({x:j, y:i});
					if(!b) {
						cells.push({x:j, y:i});
					}
				}
			}

			return cells;
		};

		this.insertNew = function() {
			var cells = a.availableCells();
			if (cells.length > 0) {
				var i = Math.floor(Math.random() * cells.length);
				var tile = new TileModel(cells[i], 2);
				var x = (cells[i].y * a.size) + cells[i].x;
				this.tiles[x] = tile;
			}
		};

		this.remove = function(pos) {
			var i = (pos.y * a.size) + pos.x;
			delete this.tiles[i];
		}

		this.build = function() {
			for (var i = 0; i < a.size * a.size; i++) {
				this.grid[i] = null;
			}

			for (var i = 0; i < a.size; i++) {
				for (var j = 0; j < a.size; j++) {
					var x = (i * a.size) + j;
					a.set({x:j, y:i}, null);
				}
			}

			this.insertNew();
			this.insertNew();
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