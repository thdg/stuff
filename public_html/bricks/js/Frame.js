"use strict";

// ==========
// FRAME STUFF
// ==========

// A generic constructor which accepts an arbitrary descriptor object
function Frame(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Default proporties
Frame.prototype.shakeOn = true;
Frame.prototype.offsetX = 0;
Frame.prototype.offsetY = 0;
Frame.prototype.time = 0;

Frame.prototype.hit = function () {
    if (this.shakeOn) {
        g_sounds.playExplotion();
        this.time = 10;
        this.shaking = true;
    }
}

Frame.prototype.update = function (du) {
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

Frame.prototype.render = function (ctx) {
    // nothing to do here
};