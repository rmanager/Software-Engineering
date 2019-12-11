/*
* This method creates the Objects in BossLevel
*/

function BossLevel(program, x, y, z, name, view, picture) {
    this.program = program;
    var floors = [];
    this.temp = "";
    var value = 0;
	
	
    for (var j = -970; j < 590; j = j + 60) {
        temp = new DirtFloor(program, j, 30, 1000, "DirtFloor.png");
        floors.push(temp);
    }
	
	
    temp = new BigBleu(program, "Bleu", -630, 30, 900, 200, 30, "BigBleu.png");
    floors.push(temp);
	
	
    Level.call(this, program, x, y, z, name, view, picture, floors);
};
BossLevel.prototype = Object.create(Level.prototype);