/***
*	341_Game is used as our main class. The init() method
*	initializes the game onto the view buffer.
*	The getDamage(), getAttack(), and getBigAttack()
*	methods are all used for combat, finding the attack of
*	the hero and villains respectifully. The render is a recursive
*	method that consistently calls itself as it displays the game 
*	at 60 frames per second.  The onkeydown method controls key commands
*	allowing for user control.
***/




var gl;
var canvas;
const WALLHEIGHT = 70.0; // Some playing field parameters
const ARENASIZE = 1000.0;
const EYEHEIGHT = 15.0;
const HERO_VP = 0.625;

const upx = 0.0, upy = 1.0, upz = 0.0;    // Some LookAt params 

const fov = 60.0;     // Perspective view params 
const near = 1.0;
const far = 5000.0;
var aspect, eyex, eyez;

const width = 1000;       // canvas size 
const height = 625;
const vp1_left = 0;      // Left viewport -- the hero's view 
const vp1_bottom = 0;

// Lighting stuff
var la0 = [0.2, 0.2, 0.2, 1.0]; // light 0 ambient intensity 
var ld0 = [1.0, 1.0, 1.0, 1.0]; // light 0 diffuse intensity 
var ls0 = [1.0, 1.0, 1.0, 1.0]; // light 0 specular 
var lp0 = [0.0, 1.0, 1.0, 1.0]; // light 0 position -- will adjust to hero's viewpoint 
var ma = [0.02, 0.2, 0.02, 1.0]; // material ambient 
var md = [0.08, 0.06, 0.08, 1.0]; // material diffuse 
var ms = [0.06, 0.07, 0.06, 1.0]; // material specular 
var me = 1000;             // shininess exponent 
const red = [1.0, 0.0, 0.0, 1.0]; // pure red 
const blue = [0.0, 0.0, 1.0, 1.0]; // pure blue 
const green = [0.0, 1.0, 0.0, 1.0]; // pure blue 
const yellow = [1.0, 1.0, 0.0, 1.0]; // pure yellow

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var spot;
var xyz;
var program;
var mode = false;
var arena;
var door = [];
var screens = [];
var hero;
var thingSeeking;
var villain = [];
var map;
var stepCounter = -1;
var walkThisWay = 0;
var heroScore = 0;
var villainScore = 0;
var floors = [];
var floorBindings = [];
var onFloor;
var onLeft = false;
var onRight = false;
var audio = new Audio('music/Meanwhile in Bavaria.mp3');
var obj = 0;
var countDown = 60;
var gameState = 0;
var g_matrixStack = []; // Stack for storing a matrix



window.onload = function init() {
    //Set up for the Canvas and OpenGl
    canvas = document.getElementById("gl-canvas");
    //document.getElementById("villainScore").innerHTML = villainScore;
    gl = WebGLUtils.setupWebGL(canvas);
    //gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
    if (!gl) { alert("WebGL isn't available"); }

    //Configure WebGL

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    audio.play();
    //Load shaders and initialize attribute buffers

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    eyex = ARENASIZE / 2.0;	//Where the hero starts
    eyez = -ARENASIZE / 2.0;
    aspect = width / height;

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
        0); // Assume no texturing is the default used in
    // shader.  If your game object uses it, be sure
    // to switch it back to 0 for consistency with
    // those objects that use the defalt.

    var temp = function mapView() {
        modelViewMatrix = lookAt(vec3(0.0, 100.0, -0.0),
            vec3(0.0, 0.0, -0.0),
            vec3(0.0, 0.0, -1.0));
        projectionMatrix = ortho(-1000, 1000, -1000, 1000, 0, 200);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    };
	
    screens.push(temp);
    temp = function playerView() {
        modelViewMatrix = lookAt(vec3(hero.x, 100.0, hero.z),
            vec3(hero.x, EYEHEIGHT, hero.z),
            vec3(0.0, 0.0, -1.0));
        projectionMatrix = ortho(-200, 200, -200, 200, 0, 200);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    }
    screens.push(temp);
    screens[0]();


    //				End Set up fot Canvas and OpenGl
    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"), 1);
    arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
    arena.getView()();
    arena.init();
    arena.show();


    hero = new BasicCharacter(program, "Player 1", 0, 20, 0, 100, 5, "Hero_Forward.png");
    xyz = arena.getHeroStart();
    hero.setXYZ(xyz[0], xyz[1], xyz[2]);
    hero.init();
    hero.show();

    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"), 0);

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    arena.getView()();
    arena.show();
    if (hero.getHealth() > 0) {
        hero.show();
    } else {
        audio.pause();
        audio = new Audio('music/Wilhelm Scream sound effect.mp3');
        audio.play();
    }
	
    spot = hero.getXYZ();
	
    if (spot[2] > ARENASIZE)
        hero.setHealth(hero.getHealth() - 0.5);
    
	
    if (arena.getName() == "Demo" && spot[0] >= 150 && spot[0] <= 250 && spot[2] >= 50 && spot[2] <= 150) {
        arena = new Level1(program, -750, 20, 900, "Level1", screens[1], "Level1.png");
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(xyz[0], xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Double Polka.mp3');
        audio.play();
    }
	
    if (arena.getName() == "Demo" && spot[0] >= 500 && spot[0] <= 600 && spot[2] <= -500 && spot[2] >= -600) {
        arena = new Level2(program, -750, 20, 900, "Level2", screens[1], "Level1.png");
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(xyz[0], xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Double Polka.mp3');
        audio.play();
    }
	
    if (arena.getName() == "Demo" && spot[0] <= -700 && spot[0] >= -800 && spot[2] <= -50 && spot[2] >= -150) {
        arena = new Level3(program, -750, 20, 900, "Level3", screens[1], "Level1.png");
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(950, xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Four Beers Polka.mp3');
        audio.play();
    }
	
    if (arena.getName() == "Demo" && spot[0] >= 900) {
        arena = new BossLevel(program, -950, 20, 900, "BossLevel", screens[1], "Level1.png");
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(xyz[0], xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Four Beers Polka.mp3');
        audio.play();
    }
	
    if (arena.getName() == "Level1" && spot[0] <= -900 && spot[2] <= -800) {
        arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(xyz[0], xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Meanwhile in Bavaria.mp3');
        audio.play();
    }
	
    if (arena.getName() == "Level2" && spot[0] >= 100 && spot[2] <= -200) {
        arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(xyz[0], xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Meanwhile in Bavaria.mp3');
        audio.play();
    }
	
    if (arena.getName() == "Level3" && spot[0] >= 600 && spot[2] <= 0) {
        arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
        arena.init();
        floorBindings = arena.getBindings();
        xyz = arena.getHeroStart();
        hero.setXYZ(xyz[0], xyz[1], xyz[2]);
        audio.pause();
        audio = new Audio('music/Meanwhile in Bavaria.mp3');
        audio.play();
    }
	
    floorBindings = arena.getBindings();
    if (floorBindings != null && floorBindings.length != 0) {
        var heroPos = hero.getXYZ();
        var check = [];
        for (var j = 0; j < floorBindings.length; ++j) {
            var floorZ = floorBindings[j].getXYZ();
            floorZ.push(floorBindings[j].getPicture());
            if ((heroPos[0] >= floorZ[0] - 30 && heroPos[0] <= floorZ[0] + 30) && floorZ[3] == "sword.png") {
                if (floorBindings[j].getPickUp() != true) {
                    floorBindings[j].setPickUp(true);
                    hero.getSword = true;
                    hero.setSword(floorBindings[j].getAttack());
                }
            }
            if (floorBindings[j].getPicture() == "Curd.png" || floorBindings[j].getPicture() == "BigBleu.png") 
                floorZ.push(floorBindings[j].getHealth());
            else if (floorBindings[j].getPicture() == "sword.png") 
                floorZ.push(floorBindings[j].getAttack());
            if ((heroPos[0] <= floorZ[0] + 230 && heroPos[0] >= floorZ[0] - 230) && (heroPos[2] >= floorZ[2] - 150 && heroPos[2] <= floorZ[2] + 50))
                check.push(floorZ);
        }
        if (check.length > 0) {
            for (var i = 0; i < check.length; ++i) {
                if (heroPos[0] <= check[i][0] + 35 && heroPos[0] >= check[i][0] - 35 && heroPos[2] >= check[i][2] - 120 && heroPos[2] <= check[i][2] - 100 && check[i][3] != "sword.png") {
                    onFloor = true;
                    break;
                }
                else { onFloor = false; }
            }
            for (var i = 0; i < check.length; ++i) {
                if (heroPos[2] > check[i][2] - 100 && heroPos[2] <= check[i][2] + 50) {
                    if (check[i][3] != "Curd.png" && check[i][3] != "sword.png" && check[i][3] != "BigBleu.png") {
                        if (heroPos[0] <= check[i][0] + 40 && heroPos[0] >= check[i][0]) {
                            onLeft = true;
                            break;
                        }
                        else { onLeft = false; }
                        if (heroPos[0] >= check[i][0] - 40 && heroPos[0] <= check[i][0]) {
                            console.log("onRight");
                            onRight = true;
                            break;
                        }
                        else { onRight = false; }
                    }
                    else if ((heroPos[0] >= check[i][0] - 30 && heroPos[0] <= check[i][0] + 30) && check[i][3] == "Curd.png" && check[i][4] > 0) {
                        hero.setHealth(getAttack(hero.getHealth()));
                    }
                    else if ((heroPos[0] >= check[i][0] - 230 && heroPos[0] <= check[i][0] + 230) && check[i][3] == "BigBleu.png") {
                        if (check[i][4] > 0) {
                            hero.setHealth(getBigAttack(hero.getHealth()));
                        } else {
                            arena = new Level(program, 0, 60, 0, "End", screens[0], "End.png",[]);
                            audio.pause();
                            arena.init();
                        }
                    }
                }
            }
        } else {
            onFloor = false;
            onRight = false;
            onLeft = false;
        }
        if (onFloor == false) {
            hero.moveZ(3);
        }
    }
    requestAnimFrame(render);
};


getDamage = function (villainHealth) {
    villainHealth = villainHealth - hero.getAttack();
    return (villainHealth);
};


getAttack = function (heroHealth) {
    if (countDown <= 0) {
        countDown = 60;
        heroHealth = heroHealth - 5;

    } else { --countDown; }
    return (heroHealth);
};


getBigAttack = function (heroHealth) {
    if (countDown <= 0) {
        countDown = 60;
        heroHealth = heroHealth - 20;

    } else { --countDown; }
    return (heroHealth);
};


window.onkeydown = function (event) {
    var key = String.fromCharCode(event.keyCode);
    switch (key) {
        case 'D':
            if (onRight == false) {
                hero.moveX(5);
            }
            break;
        case 'A':
            if (onLeft == false) {
                hero.moveX(-5);
            }
            break;
        case 'S':
            if (arena.getName() == "Demo") {
                hero.moveZ(5);
            }
            break;
        case 'W':
            if (arena.getName() == "Demo") {
                hero.moveZ(-5);
            }
            break;
        case 'E':
            if (onFloor == true && arena.getName() != "Demo") {
                hero.jump();
            }
            break;
        case 'R':
            if (hero.getHealth() <= 0) {
                var xyz = arena.getHeroStart();
                hero.setXYZ(xyz[0], xyz[1], xyz[2]);
                hero.setHealth(100);
                audio.play();
            }
            break;
        case 'C':
            floorBindings = arena.getBindings();
            if (floorBindings != null && floorBindings.length != 0) {
                var heroPos = hero.getXYZ();
                for (var i = 0; i < floorBindings.length; ++i) {
                    var floorZ = floorBindings[i].getXYZ();
                    floorZ.push(floorBindings[i].getPicture());
                    if (heroPos[0] <= floorZ[0] + 60 && heroPos[0] >= floorZ[0] - 60 && (floorZ[3] == "Curd.png" || floorZ[3] == "BigBleu.png"))
                        floorBindings[i].setHealth(getDamage(floorBindings[i].getHealth()));
                }
            }
            break;
    }
};

