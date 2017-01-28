"use strict";

// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Default proporties
Paddle.prototype.cx = g_canvas.width/2;
Paddle.prototype.cy = g_canvas.height*0.95;

Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 10;

Paddle.prototype.speed = 10;

Paddle.prototype.hit = function () {
    g_sounds.playHit2();
}

Paddle.prototype.update = function (du) {
    var nextX = this.cx;
    if (g_keys[this.GO_LEFT]) {
        nextX -= this.speed * du;
    }
    if (g_keys[this.GO_RIGHT]) {
        nextX += this.speed * du;
    }
    if (nextX<this.halfWidth) {
        this.cx = this.halfWidth;
    } else
    if (g_canvas.width-this.halfWidth<nextX) {
        this.cx = g_canvas.width-this.halfWidth;
    } else {
        this.cx = nextX;
    }
};

Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    fillBox(
        ctx,
        this.cx - this.halfWidth,
        this.cy - this.halfHeight,
        this.halfWidth * 2,
        this.halfHeight * 2,
        this.color
    );
};
