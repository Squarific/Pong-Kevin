"use strict"
var singleGamesStarted = 0;
var duoGamesStarted = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, 800, 400);


function Pong (ctx) {
	var lastUpdate = Date.now(),
		bol, bol2, player1, player2, showinstructions,
		pong = this, state = 0, paused = false;
	
	document.addEventListener('keypress', function (event) {
		var pressedKey = event.keyCode || event.which || event.charCode;
		console.log(pressedKey);
		if (!this.levens) {
			if (pressedKey === 49) {
				this.startpong1();
			} else if (pressedKey === 50) {
				this.startpong2();
			} else if (pressedKey === 109) {
				state = 0;
			}
		}
		if (pressedKey === 112) {
			paused = !paused;
		}
	}.bind(this), false);
	
	this.keydown = function (event) {
		var pressedKey = event.keyCode || event.which || event.charCode;
		if (pressedKey === 73) {
			showinstructions = true;
		}
	};
	
	this.keyup = function (event) {
		var pressedKey = event.keyCode || event.which || event.charCode;
		if (pressedKey === 73) {
			showinstructions = false;
		}
	};
	
	document.addEventListener("keydown", this.keydown, false);
	document.addEventListener("keyup", this.keyup, false);
	
	
	this.showinstructions = function (ctx){
		ctx.font = '20px calibri';
		ctx.fillStyle = 'white';
		ctx.fillText('1 player: arrows to move', 300 , 320 );
		ctx.fillText('2 players: left player: w and s / right player: o and l', 300 , 350 );
	};

	function Muur () {
		this.x = 790;
		this.y = 0
		this.height = 400;
		
		this.draw = function (ctx) {
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillRect(this.x, this.y, 10, this.height);
		};
		
		this.update = function () {
		};
	};
	
	function Balkje (x, upkeynumber, downkeynumber) {
		this.height = 80;
		this.x = x;
		this.y = 200;
		this.yVelocity = 0.2;
		
		var upkey = false,
			downkey = false;
			
		this.draw = function (ctx) {
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillRect(this.x, this.y, 10, this.height);
		};
		
		this.update = function (deltaTime) {
			if (upkey) {
				if (this.y - deltaTime * this.yVelocity > 0) {
					this.y -= deltaTime * this.yVelocity;
				}
			}
			if (downkey) {
				if (this.y + deltaTime * this.yVelocity < 400 - this.height) {
					this.y += deltaTime * this.yVelocity;
				}
			}
		};
		
		this.keydown = function (event) {
			if (event.keyCode === upkeynumber) {
				upkey = true;
				if (state && !paused) {
					event.preventDefault(); //Don't scroll when game is playing
				}
			} else if (event.keyCode === downkeynumber) {
				downkey = true;
				if (state && !paused) {
					event.preventDefault(); //Don't scroll when game is playing
				}
			}
		}
		this.keyup = function (event) {
			if (event.keyCode === upkeynumber) {
				upkey = false;
			} else if (event.keyCode === downkeynumber) {
				downkey = false;
			}
		}
		document.addEventListener('keydown', this.keydown.bind(this), false);
		document.addEventListener('keyup', this.keyup.bind(this), false);
	};
	
	function Bol (xVelocity, yVelocity) {
		this.x = 400;
		this.y = 200;
		this.xVelocity = xVelocity;
		this.yVelocity = yVelocity;
		this.colour = 'rgb(255 ,255 ,255)';
		
		this.update = function (deltaTime) {
			var x = this.x + this.xVelocity * deltaTime;
			var y = this.y + this.yVelocity * deltaTime;
			if (y + 10 > 400){
				this.yVelocity *= -1;
			} else if (y < 0) {
				this.yVelocity *= -1;
			}
			if (x > player2.x) {
				if ((player2.y > this.y + 10) || (player2.y + player2.height < this.y)) {
					this.xVelocity = 0;
					this.yVelocity = 0;
					this.x = 400;
					this.y = 200;
					this.colour = 'black';
					pong.levens--;
				} else {
					if (state === 2) {
						pong.score2++
					}
					this.xVelocity *= -1.05;
					if (state === 1 && pong.levens > 1){														// pong = reference to Pong
					}
				}
			}
			if (x < player1.x + 10){
				if ((player1.y > this.y + 10) || (player1.y + player1.height < this.y)) {
					this.xVelocity = 0;
					this.yVelocity = 0;
					this.x = 400;
					this.y = 200;
					this.colour = 'black';
					pong.levens--;
				} else {
					this.xVelocity *= -1.05;
					if (state === 1 && pong.levens > 1) {
						pong.score += 2; 														// pong = reference to Pong
						player2.x -= 4;
						player1.height -= 1;
					} else if (state === 1) {
						pong.score++;
						player2.x -= 2;
						player1.height -= 1;
					}
					if (state === 2) {
						pong.score1++
					}
				}
			}
			
			this.x += this.xVelocity * deltaTime;
			this.y += this.yVelocity * deltaTime;
		}
		
		this.draw = function (ctx) {
			ctx.fillStyle = this.colour;
			ctx.fillRect(this.x, this.y, 10, 10);
		}
	};
	
	this.loop = function loop () {
		this.update();
		this.draw();
		requestAnimationFrame(this.loop.bind(this));
	};
	
	this.update = function () {
		var deltaTime = Date.now() - lastUpdate;
		if (state && !paused) {
			bol.update(deltaTime);
			bol2.update(deltaTime);
			player1.update(deltaTime);
			player2.update(deltaTime);
		}
		lastUpdate += deltaTime;
	};
	
	this.drawScoreAndLife = function (ctx) {
		if (state === 1) {
			ctx.font = '20px calibri';
			ctx.fillStyle = 'white';
			ctx.fillText('Score: ' + this.score, 356, 25)
			ctx.fillText('Life: ' + this.levens, 290, 25);
		}
		if (state === 2) {
			ctx.font = '20px calibri';
			ctx.fillStyle = 'white';
			ctx.fillText('Score: ' + this.score1, 40, 25)
			ctx.fillText('Score: ' + this.score2, 700, 25);
			ctx.fillText('Total score: ' + (this.score1 + this.score2), 350, 25);
		}
	};
	
	this.drawGame = function (ctx) {
		bol.draw(ctx);
		bol2.draw(ctx);
		player1.draw(ctx);
		player2.draw(ctx);
		this.drawScoreAndLife(ctx);
		if (state === 1) {
			if (pong.levens === 0) {
				ctx.font = '20px calibri';
				ctx.fillStyle = 'white';
				ctx.fillText('You lose', 310, 200);
				ctx.fillText('Press \'1\' to try again', 265, 230);
				ctx.fillText('High score: 68', 285, 260);
			}
		}
		if (state === 2)  {
			if (pong.levens === 0) {
				ctx.font = '20px calibri';
				ctx.fillStyle = 'white';
				ctx.fillText('Press \'2\' to play again', 310, 230);
				ctx.fillText('High score: 59', 330, 260);
			}
		}
	};
	
	this.drawMenu = function (ctx) {
		ctx.font = '20px calibri';
		ctx.fillStyle = 'white';
		ctx.fillText('Press \'m\' for menu', 300, 170);
		ctx.fillText('Press \'1\' for 1 player', 300, 200);
		ctx.fillText('Press \'2\' for 2 players', 300, 230);
		ctx.fillText('Press i for instructions', 300, 260);
		ctx.fillText('Press p to pause', 300, 290);
	};
	
	this.draw = function () {
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillRect(0, 0, 800, 400);
		if (state){
			this.drawGame(ctx);
		} else {
			this.drawMenu(ctx);
		}
		if (showinstructions) {
			this.showinstructions(ctx);
		}
	};
	
	this.startpong1 = function () {
		if (ga) {
			singleGamesStarted++;
			ga("send", "event", "pong", "startpong1", "start", singleGamesStarted);
		}
		state = 1;
		console.log(state);
		player1 = new Balkje(20, 38, 40);
		bol = new Bol(0.2, 0.2);
		bol2 = new Bol(-0.2, -0.2);
		player2 = new Muur();
		this.score = 0;
		this.levens = 2;
	};
	
	this.startpong2 = function () {
		if (ga) {
			duoGamesStarted++;
			ga("send", "event", "pong", "startpong2", "start", duoGamesStarted);
		}
		state = 2;
		player1 = new Balkje(20, 87, 83);
		player2 = new Balkje(770, 79, 76);
		bol = new Bol(0.2, 0.2);
		bol2 = new Bol(-0.2, -0.2);
		this.score1 = 0;
		this.score2 = 0;
		this.levens = 2;
	};
};

var pong = new Pong(ctx);
pong.loop();