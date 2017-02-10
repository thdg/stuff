function Emulator() {}
Emulator.prototype.cells = document.getElementById('board').getElementsByClassName('cell');
Emulator.prototype.emulate = function(player, action) {
    var x = action, y = 0;
    while ( y<6 &&
    	!(this.cells[x+y*7].classList.contains('p1') ||
    	  this.cells[x+y*7].classList.contains('p2'))
	) {
		y++;
	}
	y--;
	var cl = player===1 ? "p1" : "p2";
	drop(x,y,cl);
    //this.cells[x+y*7].classList.add(cl);
}
Emulator.prototype.clean = function() {
	for (var i=0; i<this.cells.length; i++) {
		this.cells[i].classList.remove('p1');
		this.cells[i].classList.remove('p2');
	}
}
function drop(x, y, c, i) {
	if (typeof i === 'undefined') var i = 0;
	setTimeout(function(){
		if (i>=y) return true;
		drop(x,y,c,i+1);
	},20);
	if (i>0) game.emulator.cells[x+(i-1)*7].classList.remove(c);
	game.emulator.cells[x+i*7].classList.add(c);
}

function Game() {}
Game.prototype.active_player = 1;
Game.prototype.game_over = false;
Game.prototype.board = new Board();
Game.prototype.emulator = new Emulator();
Game.prototype.winner = false;
Game.prototype.new_game = function() {
	this.winner = false;
	this.board.clean();
	this.emulator.clean();
	this.active_player = 1;
}
Game.prototype.restart = function() {
	this.winner = false;
	this.game_over = false;
	this.board.clean();
	this.emulator.clean();
	this.active_player = Math.random() < 0.5 ? 1 : -1;
	if (this.active_player == -1)
		this.play(kyle.getAction(game.board, game.active_player));
	kyle.say("Of course you do!");
	ga('send', 'event', 'Connect 4', 'New Game');
	g_player_turn = true;
}
Game.prototype.play = function(action) {
	var player, ap = this.active_player;
	this.board = this.board.simulate(ap, action);
	this.emulator.emulate(ap, action);
	this.active_player *= -1;
	var winner = this.board.checkForWinner();
	if (winner !== 0) this.game_over = true;
	return winner; 
}

var game = new Game();
var kyle = new Kyle();
function talkNow(words, i) {
	if (typeof i === 'undefined') var i = 0;
	setTimeout(function() {
        if(i >= words.length) {
         return true;   
        }
       talkNow(words,i+1);        
    },30);
	kyle.say(words.substr(0,i));
}
function talkIn(time, words) {
	setTimeout(function(){talkNow(words);}, time);
}
talkIn(0,"Hi! I'm Kyle. Do you want to play Connect 4?");

var g_player_turn;
setTimeout( 
	function() {
		kyle.say('Hi! I\'m Kyle. Do you want to play Connect 4? <a href="#" onclick="game.restart();">Yes</a>');
	},
	1800
);

window.onload = function() {
	var cells = document.getElementsByClassName('cell');
	for (var i=0; i<cells.length; i++) {
		cells[i].onclick = function(e) {
			if (typeof g_player_turn === 'undefined' || game.game_over) return;
			if (!g_player_turn) {
				kyle.say("Easy there, It's not your turn yet!");
				return;
			}
			g_player_turn = false;
			var winnar;
			var action = e.target.getAttribute('data-cell');
			action = action%7;
			if (game.board.validMoves().indexOf(action) === -1) {
				kyle.say("Silly human! You can't do that.");
				g_player_turn = true;
				return;
			}
			if (0<=action && action<7) {
				winner = game.play(action);
			}
			setTimeout(function(){
				if (winner === 0)
					winner = game.play(kyle.getAction(game.board, game.active_player));

				if (winner !== 0) {
					var words = "";
					if (winner === -1) words = "Yayyy I won! ";
					else words = "What?! You won! ";
					ga('send', 'event', "Connect 4", "Game Over",  winner === 1 ? "AI" : "User");
					kyle.say(words+'Rematch? <a href="#" onclick="ga(\'send\', \'event\', \'Connect 4\', \'Rematch\'); game.restart();">Yes</a>');
					return;
				}
				kyle.yourTurn();
				g_player_turn = true;
			},200);
		}
	}
}