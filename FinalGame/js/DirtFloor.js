/*
* This abstract class creates DirtFloor Floor Objects
*/

function DirtFloor(program, x, y, z, picture)  {
	Floor.call(this, program, x, y, z, picture);
};
DirtFloor.prototype = Object.create(Floor.prototype);