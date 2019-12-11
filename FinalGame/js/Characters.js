/*
* This method creates Character Objects used for Hero
* and Villain Objects.  This psuedo-abstract class
* (I know JavaScript abstract classes who would've thought)
* stores the texture, the [x,y,z] coordinates, the health, 
* attack, and name of the Character and allows helper methods
* to grab and change these variables. 
*/

function Characters(program, name, x, y, z, health, attack, picture)  {
	this.name = name;		//String
    this.x = x;				//Int
    this.y = y;				//Int
    this.z = z;				//Int
	this.health = health;	//Int
	this.attack = attack;	//Int
	this.picture = picture; //String

    Characters.prototype.moveX = function (speed) {		// Pass in negative speed for backward motion
		this.x = this.x + speed;
    };
	
	Characters.prototype.moveZ = function (speed) {		// Pass in negative speed for backward motion
		this.z = this.z + speed;
    };
	
	Characters.prototype.getXYZ = function () {
		return [this.x,this.y,this.z];
    };
	
	Characters.prototype.setXYZ = function(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	};
	
	Characters.prototype.getPicture = function(){
		return this.picture;
	};
	
	Characters.prototype.getHealth = function(){
		return this.health;
	};
	
	Characters.prototype.setHealth = function(health){
		this.health = health;
	};
	
	Characters.prototype.getAttack = function(){
		return this.attack;
	};
	
	Characters.prototype.setAttack = function(attack){
		this.attack = attack;
	};
};