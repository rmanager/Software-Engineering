/*
* This abstract class creates BasicCharacter Hero Objects
*/
function BasicCharacter(program, name, x, y, z, health, attack, picture)  {
    Hero.call(this, program, name, x, y, z, health, attack, picture);
    this.sword = 0;
};

BasicCharacter.prototype = Object.create(Hero.prototype);