﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="341_Game.aspx.cs" Inherits="FinalGame._341_Game" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
    <script id="vertex-shader" type="x-shader/x-vertex">
    attribute  vec4 vPosition;
    attribute  vec3 vNormal;
    attribute  vec2 vTexCoord;

    uniform int texture_flag;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec4 ambientProduct, diffuseProduct, specularProduct;
    uniform vec4 lightPosition;
    uniform float shininess;

    varying vec4 fColor;
    varying vec2 fTexCoord;

    void main()
    {
    if (texture_flag == 0) {
    vec3 pos = (modelViewMatrix * vPosition).xyz;

    //Light that moves with hero
    vec3 light = (modelViewMatrix * lightPosition).xyz;

    // Normalized vector from pos to light

    vec3 L = normalize( light - pos );

    // Next two lines compute halfway vector

    vec3 E = normalize( pos );
    vec3 H = normalize( L + E );

    vec4 NN = vec4(vNormal,0);

    // Transform vertex normal into eye coordinates

    vec3 N = normalize( (modelViewMatrix*NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;

    if( dot(L, N) < 0.0 ) {
    specular = vec4(0.0, 0.0, 0.0, 1.0);
    }
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    fColor = ambient + diffuse + specular;

    fColor.a = 1.0;
    }
    else
    {
    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    fTexCoord = vTexCoord;
    }
    }
</script>

<script id="fragment-shader" type="x-shader/x-fragment">

    precision mediump float;

    uniform highp int texture_flag;	// Necessary to be compatible with uniform in fragment shader
    uniform sampler2D texture;

    varying vec4 fColor;
    varying vec2 fTexCoord;

    void main()
    {
    if (texture_flag == 0) {
    gl_FragColor = fColor;
    } else {
    gl_FragColor = texture2D( texture, fTexCoord );
    }
    }
</script>

<!--Ed Angel WebGL support libraries-->
<script type="text/javascript" src="common/webgl-utils.js"></script>
<script type="text/javascript" src="common/initShaders.js"></script>
<script type="text/javascript" src="common/MV.js"></script>
<script type="text/javascript" src="common/webgl-debug.js"></script>
<script type="text/javascript" src="js/341_Game.js"></script>

<script type="text/javascript" src="js/Screens.js"></script>
<script type="text/javascript" src="js/Characters.js"></script>
<script type="text/javascript" src="js/Objects.js"></script>

<script type="text/javascript" src="js/Hero.js"></script>
<script type="text/javascript" src="js/Villain.js"></script>
<script type="text/javascript" src="js/Map.js"></script>
<script type="text/javascript" src="js/Level.js"></script>
<script type="text/javascript" src="js/Floor.js"></script>
<script type="text/javascript" src="js/Sword.js"></script>

<script type="text/javascript" src="js/BasicCharacter.js"></script>
<script type="text/javascript" src="js/Level1.js"></script>
<script type="text/javascript" src="js/Level2.js"></script>
<script type="text/javascript" src="js/Level3.js"></script>
<script type="text/javascript" src="js/BossLevel.js"></script>
<script type="text/javascript" src="js/Curd.js"></script>
<script type="text/javascript" src="js/DirtFloor.js"></script>
<script type="text/javascript" src="js/BigBleu.js"></script>
<script type="text/javascript" src="js/Border.js"></script>
<script type="text/javascript" src="js/BasicSword.js"></script>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
    <!--Character Stats-->
    <textarea style="background-color: #3cbd4a; width: 1238px; height: 40px; position: absolute; top: 5px; left: 5px;" readonly>Character Stats: Health: </textarea>

    <!--Quests-->
    <textarea style="background-color: #3cbd4a; height: 623px; width: 110px; position: absolute; top: 60px; left: 5px;" readonly>Quests: In Queso Emergency</textarea>

    <!--Game Screen-->
    <canvas style="position: absolute; border: solid black; top: 60px; left: 125px;" id="gl-canvas" width="1000" height="625">
        Oops ... your browser doesn't support the HTML5 canvas element
    </canvas>

    <!--Beastiary-->
    <textarea style="background-color: #3cbd4a; height: 623px; width: 110px; position: absolute; top: 60px; left: 1133px;" readonly>Beastiary:</textarea>

    <!--Equipment-->
    <fieldset style="background-color: #3cbd4a; position: absolute; top: 690px; left: 5px; width: 500px; height: 500px;" id="equip">
        <legend>Equipment</legend>
        <img src="images/TestArmor.png" alt="armor" /> <br/>
        <span id ="sword"><img src="images/sword.png" alt="sword"/></span> <br/>
    </fieldset>

    <!--Item Description-->
    <textarea style="background-color: #3cbd4a; position: absolute; top: 700px; left: 542px; width: 581px; height: 500px;" readonly>Text area of items:</textarea>

    <!--Inventory-->
    <textarea style="background-color: #3cbd4a; position: absolute; top: 700px; left: 1133px; width: 110px; height: 500px;" readonly>Inventory:</textarea>

    <!--<p>Hero Score :<span id = "heroScore"> 0 </span></p>
    <p>Villain Score :<span id = "villainScore"> 0 </span></p>-->
</body>
</html>
