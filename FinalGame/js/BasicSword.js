/*
* This is an abstract class that creates Sword Objects.
*/

function BasicSword(program, name, x, y, z, attack, picture) {
    Sword.call(this, program, name, x, y, z, attack, picture);
};
BasicSword.prototype = Object.create(Sword.prototype);