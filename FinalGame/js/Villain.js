function Villain(program, name, x, y, z, health, attack, picture)  {
    Characters.call(this, program, name, x, y, z, health, attack, picture);

    // Not all of these are used, depending on whether you texture the
    // object or render it with a lighting model
    this.vBuffer = null;
    this.tBuffer = null;
    this.nBuffer = null;
    this.iBuffer = null;
    this.vPosition = null;
    this.vNormal = null;
	this.moveState = 1;
	this.movePosition = 0;
    
    this.vertices = [
	0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
	0.5, 0.5, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 0.5,-0.5, // v0-v3-v4-v5 right
	0.5, 0.0, 0.5,  0.5, 0.5,-0.5, -0.5, 0.5,-0.5, -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
	-0.5, 0.5, 0.5, -0.5, 0.5,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
	-0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
	0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.5,-0.5,  0.5, 0.5,-0.5  // v4-v7-v6-v5 back
    ];

    // Normal
    this.normals = [
	0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
	1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
	0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
	0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
	0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ];

    // Indices of the vertices
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
};

Villain.prototype = Object.create(Characters.prototype);

Villain.prototype.move = function() {
	if(this.moveState == -1){
		if(this.movePosition == -100){this.moveState = 1;}
		else{
            this.movePosition -= 0.5;
            this.x -= 0.5;
		}
	}
	else{
		if(this.movePosition == 100){this.moveState = -1;}
		else{
			this.movePosition += 0.5;
			this.x += 0.5;
		}
	}
};

Villain.prototype.init = function() {

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

    // WebGL guarantees at least eight texture units -- see
    // http://webglstats.com/webgl/parameter/MAX_TEXTURE_IMAGE_UNITS
    
    // Texture 0
    var image3 = new Image();
    image3.crossOrigin = "anonymous";
    image3.src = "images/Curd.png";
    image3.onload = function () {
        var texture3 = gl.createTexture();
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texture3);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, image3);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
            gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };

    var image5 = new Image();
    image5.crossOrigin = "anonymous";
    image5.src = "images/BigBleu.png";
    image5.onload = function () {
        var texture5 = gl.createTexture();
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_2D, texture5);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, image5);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
            gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };
};

Villain.prototype.show = function() {

    g_matrixStack.push(modelViewMatrix);
    //modelViewMatrix = mult(modelViewMatrix, rotateY(this.degrees));
    modelViewMatrix = mult(modelViewMatrix, translate(this.x, 0.0, this.z));

    if (this.picture == "Curd.png") {
        modelViewMatrix = mult(modelViewMatrix, scalem(60.0, 50.0, 100.0));
    }
    else if (this.picture == "BigBleu.png") {
        modelViewMatrix = mult(modelViewMatrix, scalem(240.0, 50.0, 300.0));
    }

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
    this.vPosition = gl.getAttribLocation( program, "vPosition" );
    /*if (this.vPosition < 0) {
	console.log('Failed to get the storage location of vPosition');
    }*/
    gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.vPosition );    

    gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
    this.vNormal = gl.getAttribLocation( program, "vNormal" );
    /*if (this.vPosition < 0) {
	console.log('Failed to get the storage location of vPosition');
    }*/
    gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vNormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
    this.vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    /*if (this.vTexCoord < 0) {
	console.log('Failed to get the storage location of vTexCoord');
    }*/
    gl.vertexAttribPointer(this.vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vTexCoord);

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.iBuffer );

    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
 		 1);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	
	gl.enable(gl.BLEND);
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	gl.enable(gl.CULL_FACE);	
    gl.cullFace(gl.FRONT);

    if (this.picture == "Curd.png") {
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 3);
    }
    else if (this.picture == "BigBleu.png") {
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 5);
    }
    
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );  
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12 ); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24 ); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36 ); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48 );
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 60 );
	
	gl.disable(gl.BLEND );
	gl.disable(gl.CULL_FACE);
	
    modelViewMatrix = g_matrixStack.pop();
    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
		 0);
    // Disable current vertex attribute arrays so those in a different object can be activated
    gl.disableVertexAttribArray(this.vPosition);
    gl.disableVertexAttribArray(this.vNormal);
    gl.disableVertexAttribArray(this.vTexCoord);
};