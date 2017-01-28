var galaxy;
var menu;
var gl;
var vertices;
var tickInterval;
var side = -1;

var ticks = 0;
var frames = 0;
var score = 0;
var scoreElement = document.getElementById( "score" );

var boxCount = 0;
var BOXS = 0.006;
var theta = 0.0;
var thetaSPEED = 0.020;
var thetaSpeed = thetaSPEED;

var ctm = [ 1.0,0.0,0.0,0.0,
			0.0,1.0,0.0,0.0,
			0.0,0.0,1.0,0.0,
			0.0,0.0,0.0,1.0 ];

var color = [0.3, 0.7, 1.0, 1.0];

var middleWidth = 0.15;

var playerWidth = 0.05;
var playerHeight = 0.10;
var playerDist = 0.25;

var boxX = 1.0;
var boxW = 0.1;
var boxS = BOXS;

var moveRight = false;
var moveLeft = false;
var lost = false;

var color_loc;
var matrix_loc;

window.onload = init;

function init() {
	menu = document.getElementById("menu");
    galaxy = document.getElementById( "galaxy" );
    
    gl = WebGLUtils.setupWebGL( galaxy );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, galaxy.width, galaxy.height );
    gl.clearColor( 0.0, 0.3, 1.0, 1.0 );
	
	vertices = new Array(19);
	vertices[0] = point2.create([0,  playerDist+playerHeight]);
    vertices[1] = point2.create([-playerWidth,  playerDist]);
    vertices[2] = point2.create([playerWidth,  playerDist]);
	
	vertices[3] = point2.create([-middleWidth,  middleWidth]);
    vertices[4] = point2.create([ middleWidth,  middleWidth]);
    vertices[5] = point2.create([ middleWidth, -middleWidth]);
    vertices[6] = point2.create([-middleWidth, -middleWidth]);
	for (i=7; i<19; i++)
		vertices[i] = point2.create([0.0, 0.0]);
	createBox(boxX);
	
	var elements = [
		7, 8, 11,
		8, 11, 14,
		8, 9, 13,
		9, 13, 16,
		9, 10, 15,
		10, 15, 18,
		10, 7, 17,
		7, 17, 12
	]; 
	
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "shaders/vshader.glsl", "shaders/fshader.glsl" );
    gl.useProgram( program );
    
    var abId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, abId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );
	
    var eabId = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, eabId );
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), gl.STATIC_DRAW);

    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    color_loc = gl.getUniformLocation( program, "color" );
    gl.enableVertexAttribArray( color_loc );
	gl.uniform4fv( color_loc, color );
	
	matrix_loc = gl.getUniformLocation( program, "rotation" );
    gl.enableVertexAttribArray( matrix_loc );
	gl.uniformMatrix4fv( matrix_loc, false, ctm );
	
	menu.innerHTML = "Press space to start";
	
    render();
}

function createBox(x)
{
	vertices[7]  = [-x, x];			// [7]
	vertices[8]  = [x, x];			// [8]
	vertices[9]  = [x, -x];			// [9]
	vertices[10] = [-x, -x];		// [10]

	vertices[11] = [-x, (x-boxW)];	// [11]
	vertices[12] = [-(x-boxW), x];	// [12]
	vertices[13] = [(x-boxW), x];	// [13]
	vertices[14] = [x, (x-boxW)];	// [14]
	
	vertices[15] = [x, -(x-boxW)];	// [15]
	vertices[16] = [(x-boxW), -x];	// [16]
	vertices[17] = [-(x-boxW), -x];	// [17]
	vertices[18] = [-x, -(x-boxW)];	// [18]
}

function checkCollition()
{
	// check collitions for all 3 point of the players triangle
	for (i=0; i<3; i++)
	{
		var px = vertices[i][0];
		var py = vertices[i][1];

		if ( boxX>Math.abs(px) && boxX>Math.abs(py) &&					// box not too close to center
		   ( (boxX-boxW < px && px < boxX && side!=1) ||		// hit on side 1
			 (boxX-boxW < py && py < boxX && side!=0) ||		// hit on side 0
		   (-(boxX-boxW) > py && py > -boxX && side!=2) ||	// hit on side 2
		   (-(boxX-boxW) > px && px > -boxX && side!=3) ) )	// hit on side 3
		{
			return true;
		}
	}
	return false;
}

function move( theta )
{
	for (i=0; i<3; i++)
	{
		var x = vertices[i][0];
		var y = vertices[i][1];
		vertices[i][0] = x*Math.cos(theta) - y*Math.sin(theta);
		vertices[i][1] = x*Math.sin(theta) + y*Math.cos(theta);
	}
}

function tick() {
	var changeColor = false;
	// reset the box if its to small
	if (boxX<middleWidth)
	{
		boxCount++;
		boxX = 1.0+boxW;
		side = Math.floor(Math.random()*4);
		if (boxCount>0 && boxCount%5==0)
			boxS += 0.00020;
		if (boxCount>0 && boxCount%10==0 && thetaSpeed<0.027)
			thetaSpeed += 0.0020
		// start a new game if game is in lost state
		if (lost)
		{
			lost = false;
			boxS = BOXS;
			changeColor = true;
		}
	}
	// moving the box
	boxX -= boxS;
	createBox(boxX);

	// move the player if button is pressed
	if (moveRight)
		move(Math.PI/60);
	if (moveLeft)
		move(-Math.PI/60);

	var collition = checkCollition();
	if (collition && !lost)
	{
		changeColor = true;
		boxS = BOXS/2;
		lost = true; // true until a new game starts
		showMenu();
		tickInterval = clearInterval(tickInterval);
	}
	
	// 50% change of changeing color and rotation direction every sec (100 ticks * 10 ms = 1 sec)
	if (!lost && ticks%50==0 && Math.random() < 0.66)
	{
		theta = thetaSpeed * (Math.floor((Math.random()*2))*2-1);
		changeColor = true;
	}
	
	// Changin color if supposed to
	if (lost)
	{
		color = [ 1.0, 0.7, 0.7, 1.0 ]; // when you loose everything is read
		gl.clearColor( 1.0, 0.0, 0.0, 1.0 ); // background color set to red
	}
	else if (changeColor)
	{
		var r = Math.random();
		var g = Math.random();
		var b = Math.random();

		color = [ r + 0.3, g + 0.3, b + 0.3, 1.0 ]; // color changed
		gl.clearColor( r, g, b, 1.0 ); // background color changed
	}

	if (changeColor) // write to the GPU memory only if the color changed
		gl.uniform4fv( color_loc, color );

	// re-write all vertices, only the 4 points of the box in the middle and maybe the player did not change
	gl.bufferSubData( gl.ARRAY_BUFFER, 0, flatten(vertices) );

	// snuningur
	mat4.rotateZ( ctm, theta );
	gl.uniformMatrix4fv( matrix_loc, false, ctm );
	
	if (scoreElement.innerHTML == score && !lost)
		score+=3;
	else
		score=0;
	scoreElement.innerHTML = score;
	
	ticks++;
}
function render() {
    window.requestAnimFrame( render, galaxy );
	frames++;
    gl.clear( gl.COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    gl.drawArrays( gl.TRIANGLE_FAN, 3, 4 );

	if (side!=0)	
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
	if (side!=1)	
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 6*2 );
	if (side!=2)	
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12*2 );
	if (side!=3)	
		gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 18*2 );
}

function startGame() {
	if (side<0)
		side = 0;
	theta = 0;
	thetaSpeed = thetaSPEED;
	boxCount=-1;
	score = 0;
	tickInterval = setInterval(tick, 10);
	clearMenu();
}

function showMenu() {
	menu.innerHTML = "Score: " + score + "</br> Press space to play again";
}

function clearMenu() {
	menu.innerHTML = "";
}

// Input stuff

window.addEventListener('touchstart', function(e) {
	if (e.pageX<100)
		moveLeft = true;
	else
		moveRight = true;
}, false);

window.addEventListener('touchend', function(e) {
	moveLeft = false;
	moveRight = false;
}, false);

window.addEventListener('keydown', function(e) {
    if (e.keyCode === 37 || e.keyCode ===  65) {
		moveRight = true;
    }
    if (e.keyCode === 39 || e.keyCode ===  68) {
		moveLeft = true;
    }
	if (e.keyCode === 32) {
		e.preventDefault();
		if (tickInterval === undefined)
			startGame();
	}
}, false);

window.addEventListener('keyup', function(e) {
    if (e.keyCode === 37 || e.keyCode ===  65) {
		moveRight = false;
    }
    if (e.keyCode === 39 || e.keyCode ===  68) {
		moveLeft = false;
    }
}, false);