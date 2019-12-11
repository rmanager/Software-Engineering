/*
* This is the Screens pseudo abstract class. 
* This is utilized for storing the Objects
* within a level, the [x,y,z] coordinates of the hero,
* the name of the level, and the viewport.
*/
function Screens(program, x, y, z, name, view, bindings)  {
	//Use x,y,z to choose hero starting location
    this.x = x;			//Int
    this.y = y;			//Int
    this.z = z;			//Int
    this.name = name;	//String
    this.view = view;	//Function that creates the camera
	this.bindings = bindings;

    Screens.prototype.setBindings = function (bindings) {
        this.bindings = bindings;
    };

	Screens.prototype.getBindings = function () {
	return this.bindings;
    };
	
	Screens.prototype.getName = function () {
	return this.name;
    };
	
	Screens.prototype.getView = function () {
	return this.view;
    };
	
	Screens.prototype.getHeroStart = function () {
	return [this.x,this.y,this.z];
    };
};