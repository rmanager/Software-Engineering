/*
* This abstract class creates Curd Villain Objects
*/

function Curd(program, name, x, y, z, health, attack, picture)  {
	Villain.call(this, program, name, x, y, z, health, attack, picture);
};
Curd.prototype = Object.create(Villain.prototype);