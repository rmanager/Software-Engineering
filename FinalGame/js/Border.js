/*
* This is an abstract class that creates Border Objects
*/

function Border(program, x, y, z, picture)  {
	Floor.call(this, program, x, y, z, picture);
};
Border.prototype = Object.create(Floor.prototype);