"use strict";

var canvas;
var gl;

var theta_ = 0.0;


var Move_Missile_X = 0.0;
var Move_Missile_Y = 0.0;
var Move_Missile_X_Loc;
var Move_Missile_Y_Loc;

var fireMissile = 0;  // bool
var Missile_Direction_X = 0.02
var Missile_Direction_Y = 0.00

var centerTank_X = -0.55;
var centerTank_Y = -0.20;
var centerTank_X_Loc;
var centerTank_Y_Loc;

var MoveTank = 0;  // bool
var moveTank_X = 0.0;
var moveTank_Y = 0.0;
var moveTank_X_Loc;
var moveTank_Y_Loc;

var theta = 0.0;
var thetaLoc;

var vertexElem;
var vertexShader;

var vertexElem_Missile;
var vertexShader_Missile;

var fragmentElem_1;
var fragmentShader_1;

var fragmentElem_2;
var fragmentShader_2;

var program_1;
var program_2;

// These will be used to keep the last key pressed from the keyboard
var Key;
var KeyCode;

function keyFunction(event) {
    Key = event.key;
    KeyCode = event.code;

    if (KeyCode == "KeyA") // Left
    {
        theta += 0.03;
    }

    if (KeyCode == "KeyD") // Right 
    {
        theta -= 0.03;
    }

    if (KeyCode == "KeyW") {
        MoveTank = 1;
    }

    if (KeyCode == "KeyF") {
        fireMissile = 1;
    }

    if (KeyCode == "KeyR") {
        Move_Missile_X = 0;
        Move_Missile_Y = 0;
        fireMissile = 0;
    }

    if (KeyCode == "KeyT") {
        theta_ += 0.03;
    }
    if (KeyCode == "KeyY") {
        theta_ -= 0.03;
    }


}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");


    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //  Load shaders and initialize attribute buffers
    vertexElem = document.getElementById("vertex-shader");
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexElem.textContent.replace(/^\s+|\s+$/g, ''));
    gl.compileShader(vertexShader);

    vertexElem_Missile = document.getElementById("vertex-shader-missile");
    vertexShader_Missile = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader_Missile, vertexElem_Missile.textContent.replace(/^\s+|\s+$/g, ''));
    gl.compileShader(vertexShader_Missile);

    fragmentElem_1 = document.getElementById("fragment-shader-1");
    fragmentShader_1 = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader_1, fragmentElem_1.textContent.replace(/^\s+|\s+$/g, ''));
    gl.compileShader(fragmentShader_1);

    fragmentElem_2 = document.getElementById("fragment-shader-2");
    fragmentShader_2 = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader_2, fragmentElem_2.textContent.replace(/^\s+|\s+$/g, ''));
    gl.compileShader(fragmentShader_2);

    render();

    // Here we add the event listener for keypress, other options are keydown and keyup
    addEventListener('keypress', keyFunction);

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tankın yönü için dönüş hesaplamaları (theta)
    let sin_t = Math.sin(theta);
    let cos_t = Math.cos(theta);

    // Taretin yönü için dönüş hesaplamaları (theta_)
    let sin_turret = Math.sin(theta_);
    let cos_turret = Math.cos(theta_);

    let Missile_Direction_x = Missile_Direction_X * cos_turret - Missile_Direction_Y * sin_turret;
    let Missile_Direction_y = Missile_Direction_X * sin_turret + Missile_Direction_Y * cos_turret;

    if (MoveTank == 1) {
        centerTank_X += Missile_Direction_X * cos_t - Missile_Direction_Y * sin_t;
        centerTank_Y += Missile_Direction_X * sin_t + Missile_Direction_Y * cos_t;
        moveTank_X += Missile_Direction_X * cos_t - Missile_Direction_Y * sin_t;
        moveTank_Y += Missile_Direction_X * sin_t + Missile_Direction_Y * cos_t;
    }

    // Load the Hull data of the Tank into the GPU
    var vertices_hull = new Float32Array(
        [
            -0.4, -0.1, -0.4, -0.3, -0.7, -0.3, -0.4, -0.1, -0.7, -0.1, -0.7, -0.3,
        ]);



    var buffer_hull = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_hull);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_hull, gl.STATIC_DRAW);
    program_1 = gl.createProgram();
    gl.attachShader(program_1, vertexShader);
    gl.attachShader(program_1, fragmentShader_1);
    gl.linkProgram(program_1);
    gl.useProgram(program_1);

    var positionLoc_1 = gl.getAttribLocation(program_1, "vPosition");
    gl.vertexAttribPointer(positionLoc_1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc_1);

    thetaLoc = gl.getUniformLocation(program_1, "vTheta");
    gl.uniform1f(thetaLoc, theta);
    centerTank_X_Loc = gl.getUniformLocation(program_1, "v_centerTank_X");
    gl.uniform1f(centerTank_X_Loc, centerTank_X);
    centerTank_Y_Loc = gl.getUniformLocation(program_1, "v_centerTank_Y");
    gl.uniform1f(centerTank_Y_Loc, centerTank_Y);
    moveTank_X_Loc = gl.getUniformLocation(program_1, "v_moveTank_X");
    gl.uniform1f(moveTank_X_Loc, moveTank_X);
    moveTank_Y_Loc = gl.getUniformLocation(program_1, "v_moveTank_Y");
    gl.uniform1f(moveTank_Y_Loc, moveTank_Y);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Load the Turret data of the Tank into the GPU
    var vertices_turret = new Float32Array(
        [
            -0.5, -0.15, -0.5, -0.25, -0.6, -0.25, -0.5, -0.15, -0.6, -0.25, -0.6, -0.15,
            -0.5, -0.19, -0.5, -0.21, -0.25, -0.21, -0.5, -0.19, -0.25, -0.19, -0.25, -0.21,
        ]);
    var buffer_turret = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_turret);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_turret, gl.STATIC_DRAW);
    program_2 = gl.createProgram();
    gl.attachShader(program_2, vertexShader);
    gl.attachShader(program_2, fragmentShader_2);
    gl.linkProgram(program_2);
    gl.useProgram(program_2);

    var positionLoc_2 = gl.getAttribLocation(program_2, "vPosition");
    gl.vertexAttribPointer(positionLoc_2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc_2);

    thetaLoc = gl.getUniformLocation(program_2, "vTheta");
    gl.uniform1f(thetaLoc, theta_); // Taret için bağımsız theta_

    centerTank_X_Loc = gl.getUniformLocation(program_2, "v_centerTank_X");
    gl.uniform1f(centerTank_X_Loc, centerTank_X);
    centerTank_Y_Loc = gl.getUniformLocation(program_2, "v_centerTank_Y");
    gl.uniform1f(centerTank_Y_Loc, centerTank_Y);
    moveTank_X_Loc = gl.getUniformLocation(program_2, "v_moveTank_X");
    gl.uniform1f(moveTank_X_Loc, moveTank_X);
    moveTank_Y_Loc = gl.getUniformLocation(program_2, "v_moveTank_Y");
    gl.uniform1f(moveTank_Y_Loc, moveTank_Y);

    gl.drawArrays(gl.TRIANGLES, 0, 12);

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Load the Missile data of the Tank into the GPU
    var vertices_missile = new Float32Array(
        [
            -0.24, -0.19, -0.24, -0.21, -0.21, -0.20,
        ]);
    var buffer_missile = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_missile);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_missile, gl.STATIC_DRAW);
    program_2 = gl.createProgram();
    gl.attachShader(program_2, vertexShader_Missile);
    gl.attachShader(program_2, fragmentShader_2);
    gl.linkProgram(program_2);
    gl.useProgram(program_2);

    var positionLoc_2 = gl.getAttribLocation(program_2, "vPosition");
    gl.vertexAttribPointer(positionLoc_2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc_2);

    thetaLoc = gl.getUniformLocation(program_2, "vTheta");
    gl.uniform1f(thetaLoc, theta_); // Mermi için de taret açısı theta_

    centerTank_X_Loc = gl.getUniformLocation(program_2, "v_centerTank_X");
    gl.uniform1f(centerTank_X_Loc, centerTank_X);
    centerTank_Y_Loc = gl.getUniformLocation(program_2, "v_centerTank_Y");
    gl.uniform1f(centerTank_Y_Loc, centerTank_Y);
    moveTank_X_Loc = gl.getUniformLocation(program_2, "v_moveTank_X");
    gl.uniform1f(moveTank_X_Loc, moveTank_X);
    moveTank_Y_Loc = gl.getUniformLocation(program_2, "v_moveTank_Y");
    gl.uniform1f(moveTank_Y_Loc, moveTank_Y);

    if (fireMissile == 1) {
        Move_Missile_X += Missile_Direction_x;
        Move_Missile_Y += Missile_Direction_y;
    }
    if (KeyCode == "KeyR") {
        fireMissile = 0;
        Move_Missile_X = 0;
        Move_Missile_Y = 0;
    }
    Move_Missile_X_Loc = gl.getUniformLocation(program_2, "v_Move_Missile_X");
    gl.uniform1f(Move_Missile_X_Loc, Move_Missile_X);
    Move_Missile_Y_Loc = gl.getUniformLocation(program_2, "v_Move_Missile_Y");
    gl.uniform1f(Move_Missile_Y_Loc, Move_Missile_Y);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    MoveTank = 0;
    requestAnimationFrame(render);
}