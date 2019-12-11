/*
* This is the Level class.  The Level stores a texture 
* a scene array of Objects, [x,y,z], the name, and the
* viewport coordinates. The init() and show() methods
* initialize and display the Level through the view buffer.
*/
function Level (program, x, y, z, name, view, picture, scene) {
	var bindings = [];
	for(var i = 0; i < scene.length;++i){
		var temp = scene[i].getXYZ();
		var hold = [];
		hold.push(temp[0]);
		hold.push(temp[1]);
		hold.push(temp[2]-50);
		hold.push(scene[i].getPicture());
		bindings.push(hold);
	}
	
    Screens.call(this, program, x, y, z, name, view, scene);
	this.picture = picture;
    this.scene = scene;
	this.sceneSize = this.scene.length;
	this.vertices = [
	ARENASIZE, 0.5, ARENASIZE, -ARENASIZE, 0.5, ARENASIZE, -ARENASIZE, 0.0, ARENASIZE,  ARENASIZE, 0.0, ARENASIZE, // v0-v1-v2-v3 front
	ARENASIZE, 0.5, ARENASIZE,  ARENASIZE, 0.0, ARENASIZE,  ARENASIZE, 0.0,-ARENASIZE,  ARENASIZE, 0.5,-ARENASIZE, // v0-v3-v4-v5 right
	ARENASIZE, 0.0, ARENASIZE,  ARENASIZE, 0.5,-ARENASIZE, -ARENASIZE, 0.5,-ARENASIZE, -ARENASIZE, 0.5, ARENASIZE, // v0-v5-v6-v1 up
	-ARENASIZE, 0.5, ARENASIZE, -ARENASIZE, 0.5,-ARENASIZE, -ARENASIZE, 0.0,-ARENASIZE, -ARENASIZE, 0.0, ARENASIZE, // v1-v6-v7-v2 left
	-ARENASIZE, 0.0,-ARENASIZE,  ARENASIZE, 0.0,-ARENASIZE,  ARENASIZE, 0.0, ARENASIZE, -ARENASIZE, 0.0, ARENASIZE, // v7-v4-v3-v2 down
	ARENASIZE, 0.0,-ARENASIZE, -ARENASIZE, 0.0,-ARENASIZE, -ARENASIZE, 0.5,-ARENASIZE,  ARENASIZE, 0.5,-ARENASIZE  // v4-v7-v6-v5 back
    ];

    this.normals = [
	0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
	1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
	0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
	0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
	0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ];
	
	this.indices = [
	0, 1, 2,   0, 2, 3,    // front
	4, 5, 6,   4, 6, 7,    // right
	8, 9,10,   8,10,11,    // up
	12,13,14,  12,14,15,    // left
	16,17,18,  16,18,19,    // down
	20,21,22,  20,22,23     // back
    ];
    
    // Tex coords

    this.texCoord = [
	1,1, 0,1, 0,0, 1,0,
	0,1, 0,0, 1,0, 1,1,
	0,0, 1,0, 1,1, 0,1,
	1,1, 0,1, 0,0, 1,0,
	1,1, 0,1, 0,0, 1,0,
 	0,0, 1,0, 1,1, 0,1
    ];

    this.vBuffer = null;
    this.tBuffer = null;
    this.nBuffer = null;
    this.iBuffer = null;
    this.vPosition = null;
    this.vNormal = null;
};


Level.prototype = Object.create(Screens.prototype);


Level.prototype.init = function () {

	this.vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

	this.nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW );

	this.iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

	this.tBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.texCoord), gl.STATIC_DRAW );
	
	for(var i = 0; i < this.sceneSize;i++){
		this.scene[i].init();
	}
	
	// Texture 0
	var image1 = new Image();
	image1.crossOrigin = "anonymous";
	image1.src = "images/Level1.png";
	image1.onload = function() { 
	var texture1 = gl.createTexture();
	gl.activeTexture( gl.TEXTURE1);
	gl.bindTexture( gl.TEXTURE_2D, texture1 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			  gl.UNSIGNED_BYTE, image1);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
			  gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	};

	var image6 = new Image();
	image6.crossOrigin = "anonymous";
	image6.src = "images/End.png";
	image6.onload = function () {
		var texture6 = gl.createTexture();
		gl.activeTexture(gl.TEXTURE6);
		gl.bindTexture(gl.TEXTURE_2D, texture6);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE, image6);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
			gl.NEAREST_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	};

};


Level.prototype.show = function () {

	gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	this.vPosition = gl.getAttribLocation( program, "vPosition" );
	
	gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( this.vPosition );    

	gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
	this.vNormal = gl.getAttribLocation( program, "vNormal" );
	
	gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( this.vNormal );

	gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
	this.vTexCoord = gl.getAttribLocation( program, "vTexCoord");
	
	gl.vertexAttribPointer(this.vTexCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.vTexCoord);

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.iBuffer );

	gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
		 1);
    if (this.name != "End") {
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 1);
    } else{
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 6);
    } 
	gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );  
	gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12 ); 
	gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24 ); 
	gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36 ); 
	gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48 );
	gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 60 );

	gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
		 0);
	
	// Disable current vertex attribute arrays so those in a different object can be activated
	gl.disableVertexAttribArray(this.vPosition);
	gl.disableVertexAttribArray(this.vNormal);
	gl.disableVertexAttribArray(this.vTexCoord);
	for(var i = 0; i < this.sceneSize; ++i){
        if (this.scene[i].getPicture() == "Curd.png" || this.scene[i].getPicture() == "BigBleu.png") {
            if (this.scene[i].getHealth() > 0) {
                this.scene[i].move();
                this.scene[i].show();
            }
        } else if(this.scene[i].getPicture() == "sword.png") {
            if (this.scene[i].getPickUp() == false) {
                this.scene[i].show();
            }
        } else {
            this.scene[i].show();
        }
		
	}
	
};
