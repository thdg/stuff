"use strict";

// ==========
// BALL STUFF
// ==========

// A generic constructor which accepts an arbitrary descriptor object
function Ball(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.trail = [];
}

// Default proporties
Ball.prototype.dying = false;

Ball.prototype.cx = g_canvas.width*0.05;
Ball.prototype.cy = g_canvas.height*0.666;
Ball.prototype.r = g_canvas.height*0.01;

Ball.prototype.xVel = g_canvas.height*0.006;
Ball.prototype.yVel = g_canvas.height*0.006;

Ball.prototype.color = "white";
Ball.prototype.lengthOfTrail = 50;
Ball.prototype.renderTrail = true;

Ball.prototype.update = function (du) {
    var prevX = this.cx;
    var prevY = this.cy;
    
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;
    
    for (var i=0; i<g_bricks.length; i++) {
        if (this.collidesWithBox(nextX, nextY, g_bricks[i])) {
            g_bricks[i].hit();
        }
    }
    
    if (this.collidesWithBox(nextX, nextY, g_paddle)) {
        g_paddle.hit();
    }
    
    // Bounce off top and bottom edges
    if (nextY < this.r || nextY > g_canvas.height-this.r) {
        this.yVel *= -1;
        g_frame.hit();
    }
    if (nextX < this.r || nextX > g_canvas.width-this.r) {
        this.xVel *= -1;
        g_frame.hit();
    }

    this.cx += this.xVel * du;
    this.cy += this.yVel * du;
    
    this.trail.push({cx: this.cx, cy: this.cy});
    if (this.trail.length>this.lengthOfTrail) {
        this.trail.splice(1,1); // remove the oldest element
    }
};

Ball.prototype.render = function (ctx) {
    
    if (this.renderTrail) {
        var oldAlpha = ctx.globalAlpha;
        for (var i=0; i<this.trail.length; i++) {
            var intesity = i/this.trail.length;
            ctx.globalAlpha = intesity
            fillCircle(ctx, this.trail[i].cx, this.trail[i].cy, 
                       this.r*intesity, this.color);
        }
        ctx.globalAlpha = oldAlpha;
    }
    
    fillCircle(ctx, this.cx, this.cy, this.r, this.color);
};

Ball.prototype.collidesWithBox = function (nextX, nextY, box) {
    var distX = Math.abs(nextX-box.cx);
    var distY = Math.abs(nextY-box.cy);
    if (distX<box.halfWidth && distY<box.halfHeight) {
        var boxRadius = Math.sqrt(
                            Math.pow(box.halfHeight,2)+
                            Math.pow(box.halfWidth,2)
                        ); // distance form box center to a corner
        var distXY = Math.sqrt(distX*distX+distY*distY);
        if (distXY<boxRadius+this.r) {
            this.xVel *= -1;
            this.yVel *= -1;
            return true;
        }
    } else
    if (distX<box.halfWidth) {
        if (distY<this.r+box.halfHeight) {
            this.yVel *= -1;
            return true;
        }
    } else
    if (distY<box.halfHeight) {
        if (distX<this.r+box.halfWidth) {
            this.xVel *= -1;
            return true;
        }
    }
    return false;
}