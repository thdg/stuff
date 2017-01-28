"use strict";

// ==========
// PARTICLE STUFF
// ==========

var NOMINAL_GRAVITY = 0.5;

// A generic constructor which accepts an arbitrary descriptor object
function Particle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.xVel = Math.random()*20-10;
    this.yVel = -Math.random()*10;
    this.r = Math.random()*15+g_canvas.height*0.005;
    this.cx += Math.random()*40-20;
    this.cy += Math.random()*40-20;
}

// Default proporties
Particle.prototype.dying = false;
Particle.prototype.timeAlive = 0;
Particle.prototype.timeOfDeath = 50;

Particle.prototype.gravity = true;
Particle.prototype.color = "white";

Particle.prototype.update = function (du) {
    if (this.gravity)
        this.yVel += NOMINAL_GRAVITY;
    
    this.cx += this.xVel;
    this.cy += this.yVel;
    
    this.timeAlive += du;
    if (this.timeAlive>this.timeOfDeath)
        this.dying = true;    
};

Particle.prototype.render = function (ctx) {
    ctx.globalAlpha = Math.max((this.timeOfDeath-this.timeAlive)/this.timeOfDeath,0);
    fillBox(ctx, this.cx, this.cy, this.r, this.r, this.color);
    ctx.globalAlpha = 1;
};

function particleChunk(cx, cy, i, color) {
    if (i === undefined) i = 10;
    if (color === undefined) color = "white";
    while (i>0) {
        g_particles.push(new Particle({ cx: cx, cy: cy, color: color }));
        i--;
    }
}
