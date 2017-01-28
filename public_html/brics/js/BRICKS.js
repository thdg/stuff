"use strict";

/****************************************************************

 EXTRA STUFF:
  1. Multi-hit Bricks
  2. Indestuctable Bricks (just bricks with lives === infinity) C:
  3. levels (and easy to use level creator for developer)
  4. ball trail
  5. particles!!! Super awesome stuff
  6. extra ball, 10% change on spawn when brick is cleared
  7. Heavy ball shakes the world on impact
  8. Bricks also shake when hit
  9. sound...
  
 CONTROLES:
    A and D to move,
    V to toggle ball trail,
    E to spawn new ball,
    S to toggle earthquakes,
    
  
*****************************************************************/

// ============
// ENTITIES
// ============

var g_player = new Player({
    score: 0,
    lives: 3
});

var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);

var g_paddle = new Paddle({
    GO_LEFT  : KEY_A,
    GO_RIGHT : KEY_D,
    
    halfHeight: g_canvas.height/60,
    halfWidth: g_canvas.height/15,
    
    color : "white"
});

var g_sounds = new Sounds();
var g_balls = [new Ball()];
var g_bricksToRestart;
var g_bricks = getBricks(Math.floor(Math.random()*g_numberOfLevels));
var g_particles = [];
var g_frame = new Frame();

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

var TOGGLE_TRAIL = 'V'.charCodeAt(0);
var NEW_GAME = 'N'.charCodeAt(0);
var NEW_BALL = 'E'.charCodeAt(0);
var TOGGLE_ERTHQUAKE = 'S'.charCodeAt(0);

function updateSimulation(du) {
    g_paddle.update(du);
    g_frame.update(du);
    updateArray(g_balls,du);
    updateArray(g_bricks,du);
    updateArray(g_particles,du);
    
    if (g_bricksToRestart>=g_bricks.length ||
        g_balls.length < 1 ||
        g_player.lives < 1 ||
        eatKey(NEW_GAME) ) {
            restartSimulation();
    }
    
    if (eatKey(TOGGLE_TRAIL)) Ball.prototype.renderTrail = !Ball.prototype.renderTrail;
    if (eatKey(TOGGLE_ERTHQUAKE)) Frame.prototype.shakeOn = !Frame.prototype.shakeOn;
    if (eatKey(NEW_BALL)) g_balls.push(new Ball());
}

function updateArray(array, du) {
    var i = 0;
    while (array[i]) {
        if (!array[i].dying) {
            array[i++].update(du);
        } else {
            array.splice(i,1); // kill it
        }
    }
}
    
function restartSimulation() {
        g_bricks = getBricks(Math.floor(Math.random()*g_numberOfLevels));
        g_balls = [new Ball()];
}

// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    ctx.save();
    ctx.translate(g_frame.offsetX,g_frame.offsetY);
    g_paddle.render(ctx);
    renderArray(g_balls,ctx);
    renderArray(g_bricks,ctx);
    renderArray(g_particles,ctx);
    ctx.restore();
}

function renderArray(array, ctx) {
    var i = 0;
    while (array[i]) {
        array[i++].render(ctx);
    }
}

// Kick it off
g_main.init();