/*
* This is an abstract class that creates the Villain Object "BigBleu"
* (Shiver in terror as his chunks of mold stare down at you).
*/
function BigBleu(program, name, x, y, z, health, attack, picture)  {
	Villain.call(this, program, name, x, y, z, health, attack, picture);
};
BigBleu.prototype = Object.create(Villain.prototype);