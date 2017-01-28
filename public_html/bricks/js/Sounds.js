"use strict";

// ==========
// FRAME STUFF
// ==========

// A generic constructor which accepts an arbitrary descriptor object
function Sounds(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Sounds.prototype.playHit = function () { 
    var snd = new Audio("sounds/hit.wav");
    snd.play(); 
}

Sounds.prototype.playHit2 = function () { 
    var snd = new Audio("sounds/hit2.wav");
    snd.play(); 
}

Sounds.prototype.playExplotion = function () { 
    var snd = new Audio("sounds/explotion.wav");
    snd.play(); 
}