(function() {

	angular.module('twoZeroFourEight', ['Game','Grid', 'Keyboard', 'ngCookies'])
	.controller('GameController', ['GameManager', 'KeyboardService', '$scope', '$http', '$window' ,function(a, b, c, d, e) {
		this.game = a;
		c.grid = this.game.grid;
		c.tiles = this.game.tiles;
		c.score = this.game.score;
		this.getHighScore = function() {
			d.get('/serial/')
			.success(function(response) {
				c.highScore = response.highScore;
				c.temp = response.highScore;
				c.user = response.user;
				//console.log(response);
			});
		};
		this.updateHighScore = function() {
			if (c.score >= c.temp) {
				d.post('/update/', {
					'user' : c.user,
					'highScore' : c.score
				})
				.then(function(response) {
					console.log(response);
				});
			}
		};

		e.onbeforeunload = function() {
			if (c.score >= c.temp) {
				d.post('/update/', {
					'user' : c.user,
					'highScore' : c.score
				})
				.then(function(response) {
					console.log(response);
				});
			}
		};
		this.getHighScore();
		this.start = function() {
			var self = this;
			b.on(function(key) {
				
				self.game.move(key);
				c.score = self.game.score;
				if (c.score > c.highScore) {
					c.highScore = c.score;
					//self.updateHighScore();
				}
				console.log(self.game.gameOver);
				if (self.game.gameOver) {
					c.gameOver = true;
					self.updateHighScore();
				}
				c.$apply();
			});
		};
		this.newGame = function() {
			b.init();
			this.game.start();
			this.start();
		};
		this.newGame();
	}])
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	}]);

	angular.module('Game', ['Grid'])
	.service('GameManager', ['GridService' ,function(a) {
		this.grid = a.grid;
		this.tiles = a.tiles;
		this.winningVal = 2048;
		this.score = a.score;
		this.reinit = function() {
			this.win = false;
			this.gameOver = false;
		};
		this.reinit();
		this.start = function() {
			a.build();
			this.reinit();
		};

		this.movesAv = function() {
			return (a.availableCells().length > 0) || a.matchAv();
		};
		this.updateScore = function(val) {
			this.score += val;
		};

		this.move = function(key) {
			for (var i = 0; i < a.size; i++) {
				for (var j = 0; j < a.size; j++) {
					var x = i * a.size + j;
					if (this.tiles[x]) {
						this.tiles[x].merged = null;
					}
				}
			}
			var self = this;
			if (self.win) {
				return false;
			}
			var pos = {
					x: [],
					y: []
				};
			for (var i = 0; i < a.size; i++) {
				if (key === 'left')
					pos.x.push(i);
				else
					pos.x.push(a.size-i-1);
				if (key === 'up')
					pos.y.push(i);
				else
					pos.y.push(a.size-i-1);
			}
			var won = false, moved = false;
			pos.x.forEach(function(x) {
				pos.y.forEach(function(y) {
					var originalPos = {x:x, y:y};
					var tile = a.get(originalPos);
					if (tile) {
						var cell = a.nextPos(tile, key), next = cell.next;
						if (next && (next.value === tile.value) && !next.merged) {
							var newVal = tile.value * 2;
							self.updateScore(tile.value);
							if (tile.value == 2048) {
								self.win = true;
							}
							var mergedTile = a.newTile(tile, newVal);
							mergedTile.merged = true;
							a.insert(mergedTile);
							a.remove(tile);
							a.moveTile(mergedTile, next);
							if (mergedTile.value >= self.winningVal) {
								hasWon = true;
							}
							moved = true;
						} 
						else {
							a.moveTile(tile, cell.newPos);
						}

						if (originalPos.x !== cell.newPos.x || originalPos.y !== cell.newPos.y) {
							moved = true;
						}
					}
				});
			});
			if (moved) {
				a.insertNew();
				if (self.win || !self.movesAv()) {
					self.gameOver = true;
				}
			}
		};
	}]);

	angular.module('Grid', [])
	.factory('GenerateUniqueId', function() {
		var a = function() {
			var a = (new Date).getTime();
			var b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
            	var c = (a + 16 * Math.random()) % 16 | 0;
            	return a = Math.floor(a / 16),
            	("x" === b ? c : 7 & c | 8).toString(16)
        	});
        	return b;
		};
		return {
			next: function() {
				return a()
			}
		}
	})
	.factory('TileModel', ['GenerateUniqueId', function(a) {
		var Tile = function(pos, val) {
			this.x = pos.x;
			this.y = pos.y;
			this.value = val || 2;
			this.id = a.next();
			this.merged = null;
		};
		Tile.prototype.updatePos = function(newPos) {
			this.x = newPos.x;
			this.y = newPos.y;
		};

		return Tile;
	}])
	.service('GridService', ['TileModel' , function(TileModel) {
		this.grid = [];
		this.tiles = [];
		this.score = 0;
		this.size = 4;
		var a = this;
		var vectors = {
			'left' : {x:-1, y:0},
			'up' : {x:0, y:-1},
			'right': {x:1, y:0},
			'down' : {x:0, y:1}
		};
		
		this.same = function(a, b) {
            return a.x === b.x && a.y === b.y
        };
	
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

		this.insert = function(tile) {
			var i = (tile.y * a.size) + tile.x;
			this.tiles[i] = tile;
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

		this.nextPos = function(cell, key) {
			var v = vectors[key];
			var p;

			while (this.withinGrid(cell)) {
				p = cell;
				cell = {
					x: p.x + v.x,
					y: p.y + v.y
				};
				if (this.get(cell))
					break;
			}
			
			return {
				newPos: p,
				next: this.get(cell)
			};
		};

		this.moveTile = function(tile, newPos) {
			var oldPos = {
				x: tile.x,
				y: tile.y
			};

			this.set(oldPos, null);
			this.set(newPos, tile);
			tile.x = newPos.x;
			tile.y = newPos.y;
		};

		this.newTile = function(pos, value) {
  			return new TileModel(pos, value);
		};

		this.matchAv = function() {
			for (var i = 0; i < a.size; i++) {
				for (var j = 0; j < a.size; j++) {
					var x = (i * a.size) + j;
					var tile = this.tiles[x];
					if(tile) {
						for (v in vectors) {
							v = vectors[v];
							var pos = {
								x: tile.x + v.x,
								y: tile.y + v.y
							}
							var temp = this.get(pos);
							if (temp && temp.value === tile.value)
								return true;
						}
					}
					else {
						return true;
					}
				}
			}
			return false;
		}
	}]);

	angular.module('Keyboard', [])
	.service('KeyboardService', ['$document', function($document) {
		var map = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
		var a = this;
		this.eh = [];

		this.next = function(key, b) {
			var c = this.eh;
			if(!c) {
				return;
			}
			b.preventDefault();
			if(c) {
				for (var i = 0; i < c.length; i++) {
					var temp = c[i];
					temp(key, b);
				}
			}
		};

		this.on = function(b) {
			this.eh.push(b);
		};

		this.init = function() {
			this.eh = [];
			$document.bind('keydown', function(b) {
				var key = map[b.which];
				if (key) {
					b.preventDefault();
					a.next(key, b);
				}
			});
		};

	}]);	

})();