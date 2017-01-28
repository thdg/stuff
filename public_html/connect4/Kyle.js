function Kyle() {}
Kyle.prototype.getAction = function (board, player) {
	var a = board.validMoves();
	var v = [];
	for (var i=0; i<a.length; i++) {
		var newstate = board.simulate(player, a[i])
		v[i] = this.h(newstate)*player;
	}
	var maxv = 0, maxv_index = 0;
	for (var i=0; i<v.length; i++) {
		if (v[i]>maxv) {
			maxv = v[i];
			maxv_index = i;
		}
	}
	return a[maxv_index];
}
Kyle.prototype.h = function(state) {
	var C = game.board.winning_locations;
	var phi = this.getFeatures(state,C);
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
	"Do something!",
	"Humans are so slow.",
	"I'm waiting...",
	"..."
]
Kyle.prototype.yourTurn = function() {
	return this.say(this.your_turn[Math.floor(this.your_turn.length*Math.random())]);
}