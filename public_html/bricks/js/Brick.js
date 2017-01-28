"use strict";

// ==========
// BRICK STUFF
// ==========

// A generic constructor which accepts an arbitrary descriptor object
function Brick(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.setColor(this.lives)
}

// Default proporties
Brick.prototype.dying = false;
Brick.prototype.lives = 1;
Brick.prototype.offsetX = 0;
Brick.prototype.offsetY = 0;
Brick.prototype.time = 0;

Brick.prototype.setColor = function(lives) {
    switch (this.lives) {
        case 1:
            this.color = "white";
            break;
        case 2:
            this.color = "red";
            break;
        case 3:
            this.color = "blue";
            break;
        case 4:
            this.color = "green";
            break;
        default:
            this.color = "gray";
            break;
    }
}

Brick.prototype.hit = function () {
    g_sounds.playHit();
    this.shaking = true;
    this.time = 20;
    this.lives -= 1;
    particleChunk(this.cx, this.cy, 20, this.color );
}

Brick.prototype.update = function (du) {
    
    if (this.lives<=0) {
        this.dying = true;
        if (Math.random()<0.1)
            g_balls.push(new Ball({ cx: this.cx, cy: this.cy }));
    } else {
        this.setColor(this.lives);
    }
    
    if (this.shaking) {
        this.offsetX = Math.random()*10-5;
        this.offsetY = Math.random()*10-5;
        this.time -= du;
        if (this.time<0) {
            this.shaking = false;
            this.offsetX = 0;
            this.offsetY = 0;
        }
    }
};

Brick.prototype.render = function (ctx) {
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    fillBox(
        ctx,
        this.cx - this.halfWidth,
        this.cy - this.halfHeight,
        this.halfWidth * 2,
        this.halfHeight * 2,
        this.color
    );
    ctx.restore();
};