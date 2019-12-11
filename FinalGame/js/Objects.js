/*
* This is the Objects psuedo abstract class.
* It is utilized for the objects that are used
* to build levels.  It contains helper methods
* getXYZ() and getPicture() that retreive the coordinates
* of the object and the texture of the object respectively.
*/
function Objects(program, x, y, z, picture)  {

    this.x = x;				//Int
    this.y = y;				//Int
    this.z = z;				//Int
    this.picture = picture;	//String
	
	Objects.prototype.getXYZ = function () {
		return [this.x,this.y,this.z];
    };
	
	Objects.prototype.getPicture = function () {
		return this.picture;
    };
};