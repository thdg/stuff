function Board() {
	this.state = this.start_state;
}
Board.prototype.start_state = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
Board.prototype.winning_locations = [
	[0,7,14,21],
	[7,14,21,28],
	[14,21,28,35],
	[1,8,15,22],
	[8,15,22,29],
	[15,22,29,36],
	[2,9,16,23],
	[9,16,23,30],
	[16,23,30,37],
	[3,10,17,24],
	[10,17,24,31],
	[17,24,31,38],
	[4,11,18,25],
	[11,18,25,32],
	[18,25,32,39],
	[5,12,19,26],
	[12,19,26,33],
	[19,26,33,40],
	[6,13,20,27],
	[13,20,27,34],
	[20,27,34,41],
	[0,1,2,3],
	[1,2,3,4],
	[2,3,4,5],
	[3,4,5,6],
	[7,8,9,10],
	[8,9,10,11],
	[9,10,11,12],
	[10,11,12,13],
	[14,15,16,17],
	[15,16,17,18],
	[16,17,18,19],
	[17,18,19,20],
	[21,22,23,24],
	[22,23,24,25],
	[23,24,25,26],
	[24,25,26,27],
	[28,29,30,31],
	[29,30,31,32],
	[30,31,32,33],
	[31,32,33,34],
	[35,36,37,38],
	[36,37,38,39],
	[37,38,39,40],
	[38,39,40,41],
	[21,15,9,3],
	[28,22,16,10],
	[22,16,10,4],
	[35,29,23,17],
	[29,23,17,11],
	[23,17,11,5],
	[36,30,24,18],
	[30,24,18,12],
	[24,18,12,6],
	[37,31,25,19],
	[31,25,19,13],
	[38,32,26,20],
	[14,22,30,38],
	[7,15,23,31],
	[15,23,31,39],
	[0,8,16,24],
	[8,16,24,32],
	[16,24,32,40],
	[1,9,17,25],
	[9,17,25,33],
	[17,25,33,41],
	[2,10,18,26],
	[10,18,26,34],
	[3,11,19,27]
]
Board.prototype.width = 7;
Board.prototype.height = 6;
Board.prototype.simulate = function (player,action) {
	var newstate = this.state.slice(0);
    var x = action, y = 0;
    while (y+1<this.height && newstate[x+(y+1)*this.width]===0) y++;
    newstate[x+y*this.width] = player;
    return newstate;
}
Board.prototype.checkForWinner = function() {
	for (var i=0; i<this.winning_locations.length; i++) {
		var points = 0;
		var row = this.winning_locations[i];
		for (var j=0; j<row.length; j++) {
			points += this.state[row[j]];
		}
		if (Math.abs(points)===4) return points/4;
	}
    return 0;
}
Board.prototype.validMoves = function() {
	var a = [];
	for (var i=0; i<this.width; i++) {
		if (this.state[i] === 0) a[a.length] = i;
	}
	return a;
}
Board.prototype.clean = function() {
	this.state = this.start_state;
}