function Kyle() {}

Kyle.prototype.getAction = function(board, player) {
	this.player = player;

	var a = board.validMoves();
	var maxv = Number.NEGATIVE_INFINITY, maxv_index = 0;
	for (var i = 0; i < a.length; i++) {
		var nextState = board.simulate(player, a[i]);
		var v = this.alphabeta(nextState, 7, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, player*-1);
		console.log(v);
		if (v > maxv) {
			maxv = v;
			maxv_index = i;
		}
	}
	return a[maxv_index];
}

Kyle.prototype.getNextStates = function(player, board) {
	var a = board.validMoves();
	var v = [];
	for (var i=0; i<a.length; i++) {
		var newstate = board.simulate(player, a[i])
		v[i] = newstate;
	}
	return v;
}

Kyle.prototype.alphabeta = function(board, depth, a, b, player) {
	var boards = this.getNextStates(player, board);
	if (depth <= 0 || boards.length == 0 || board.checkForWinner() !== 0) {
		var v = this.h(board)*this.player;
		return v;
	} else {
		if (player == this.player) {
			var v = Number.NEGATIVE_INFINITY;
			for (var i=0; i<boards.length; i++) {
				var _v = this.alphabeta(boards[i], depth-1, a, b, this.player*-1);
				v = Math.max(v, _v);
				if (b <= v)
					break;
				a = Math.max(a, v);
			}
			return v;
		} else {
			var v = Number.POSITIVE_INFINITY;
			for (var i=0; i<boards.length; i++) {
				var _v = this.alphabeta(boards[i], depth-1, a, b, this.player);
				v = Math.min(v, _v);
				if (v <= a)
					break;
				b = Math.min(b, v);
			}
			return v;
		}
	}
}

Kyle.prototype.minmax = function(board, depth, a, b, player) {
	var b = this.getNextStates(player, board);
	if (depth <= 0 || b.length == 0 || board.checkForWinner() !== 0) {
		var v = this.h(board)*this.player;
		//console.log(v);
		return v;
	} else {
		if (player == this.player) {
			var v = Number.NEGATIVE_INFINITY;
			for (var i=0; i<b.length; i++) {
				var _v = this.minmax(b[i], depth-1, a, b, this.player*-1);
				v = Math.max(v, _v);
			}
			return v;
		} else {
			var v = Number.POSITIVE_INFINITY;
			for (var i=0; i<b.length; i++) {
				var _v = this.minmax(b[i], depth-1, a, b, this.player);
				v = Math.min(v, _v);
			}
			return v;
		}
	}
}

Kyle.prototype.h = function(state) {
	var winner = state.checkForWinner();
	if (winner !== 0) return Number.POSITIVE_INFINITY*winner;

	var C = game.board.winning_locations;
	var phi = this.getFeatures(state.state,C);
	var v = 0;
	for (var i=0; i<phi.length; i++) {
		v += phi[i]*Math.pow(2,Math.abs(phi[i]));
	}
	return v;
}

Kyle.prototype.getFeatures = function(state, C) {
	var phipos = [], phineg = [], phi = [];
	for (var i=0; i<C.length; i++) {
		phipos[i] = 0;
		phineg[i] = 0;
		for (var j=0; j<C[i].length; j++) {
			var c = C[i][j]
			if (state[c] === 1)
				phipos[i] += 1;
			else if (state[c] === -1)
				phineg[i] -=1;
		}
		if (phipos[i] !== 0 && phineg[i] !== 0) phi[i] = 0;
		else phi[i] = phipos[i] + phineg[i];
	}
	return phi;
}
Kyle.prototype.mouth = document.getElementById('kyle');
Kyle.prototype.say = function(what) {
	this.mouth.innerHTML = what;
}
Kyle.prototype.your_turn = [
	"It's your turn!",
	"Do something!",
	"Common!",
	"Go go go!",
	"Humans are so slow.",
	"I'm waiting...",
	"..."
]
Kyle.prototype.yourTurn = function() {
	return this.say(this.your_turn[Math.floor(this.your_turn.length*Math.random())]);
}