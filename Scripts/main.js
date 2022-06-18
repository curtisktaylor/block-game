let xCoord = document.getElementById("x");
let yCoord = document.getElementById("y");
let zCoord = document.getElementById("z");
let currentChunk = document.getElementById("chunk");
let canvas = document.getElementById("canvas");
let fpsCounter = document.getElementById("fps");

let width = window.innerWidth;
let height = window.innerHeight;

let scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2(0xadd8e6, 0.004);
scene.background = new THREE.Color(0xadd8e6);
let camera = new THREE.PerspectiveCamera( 80, width / height, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer({antialias: false, canvas: canvas});
renderer.setPixelRatio( window.devicePixelRatio * (3/4) );
renderer.setSize( width, height );


let geometry = new THREE.PlaneGeometry( 5, 5);
let material = new THREE.MeshBasicMaterial( {color: "#ffff00", side: THREE.DoubleSide} );
let plane = new THREE.Mesh( geometry, material );
plane.name = "e";
scene.add( plane );

let text = document.getElementsByTagName("p");//separates the text elements so they arent all in the same spot
for(let i = 0; i < text.length; i++){
    text[i].style.paddingTop = (i * 18) + "px";
    text[i].style.paddingLeft = 20 + "px";
}


plane.position.z = 5;
plane.position.x = 5;



let lastUpdate = Date.now();

let p = new player(scene, camera, 0, 5 * 16 * 6, 0, 5, 8, 5);


let fps = 0;
let now;
let deltaTime;
let lastSecond = Date.now();


requestAnimationFrame(animate);



function animate() {

    //setup for deltatime and fps counter stuff
    now = Date.now();
    deltaTime = (now - lastUpdate) / (1000/60);
    lastUpdate = now;

    //update fps counter if 1 second has passed
    if(now - lastSecond >= 1000){
        fpsCounter.innerHTML = "FPS: " + fps;
        fps = 0;
        lastSecond = now;
    }

    //counting how many frames were drawn this second
    fps++;


    /*xCoord.innerHTML = "X: " + p.worldX.toFixed(2);
    yCoord.innerHTML = "Y: " + p.worldY.toFixed(2);
    zCoord.innerHTML = "Z: " + p.worldZ.toFixed(2);*/
    xCoord.innerHTML = "X: " + p.fX;
    yCoord.innerHTML = "Y: " + p.fY;
    zCoord.innerHTML = "Z: " + p.fZ;

    currentChunk.innerHTML = "Chunk: [" + p.chunkX + ", " + p.chunkY + ", " + p.chunkZ + "]";

    //move player
    p.updateMove(camera, deltaTime);

    //draw frame
    renderer.render( scene, camera );
    
    requestAnimationFrame(animate);
}

function updateFps(){
    document.getElementById("fps").innerHTML = "FPS: " + fps;
    fps = 0;
}






document.addEventListener("keydown", function(event){
    if(event.keyCode == 37){//left
        p.turnX = -1;
    }

    if(event.keyCode == 39){//right
        p.turnX = 1;
    }

    if(event.keyCode == 38){//up
        p.turnY = 1;
    }

    if(event.keyCode == 40){//down
        p.turnY = -1;
    }



    if(event.keyCode == 87){//move forward
        p.moveF = 1;
    }

    if(event.keyCode == 83){//move backward
        p.moveF = -1;
    }

    if(event.keyCode == 65){//move left
        p.moveS = -1;
    }

    if(event.keyCode == 68){//move right
        p.moveS = 1;
    }

    if(event.keyCode == 32){//move up
        p.moveV = 1;
    }

    if(event.keyCode == 82){//move down
        p.moveV = -1;
    }
});

document.addEventListener("keyup", function(event){
    if(event.keyCode == 37){//left
        p.turnX = 0;
    }

    if(event.keyCode == 39){//right
        p.turnX = 0;
    }

    if(event.keyCode == 38){//up
        p.turnY = 0;
    }

    if(event.keyCode == 40){//down
        p.turnY = 0;
    }



    if(event.keyCode == 87){//move forward
        p.moveF = 0;
    }

    if(event.keyCode == 83){//move backward
        p.moveF = 0;
    }

    if(event.keyCode == 65){//move left
        p.moveS = 0;
    }

    if(event.keyCode == 68){//move right
        p.moveS = 0;
    }

    if(event.keyCode == 32){//move up
        p.moveV = 0;
    }

    if(event.keyCode == 82){//move down
        p.moveV = 0;
    }
});

//lock and hide cursor onto screen when window is clicked
document.addEventListener("mousedown", function(){
    canvas.requestPointerLock = canvas.requestPointerLock ||canvas.mozRequestPointerLock;

    canvas.requestPointerLock()
});

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
      document.addEventListener("mousemove", updateMouse, false);
    } else {
      document.removeEventListener("mousemove", updateMouse, false);
    }
  }
  

function updateMouse(m){
    p.cameraX += m.movementX * p.cameraSensitivity;
    p.cameraY -= m.movementY * p.cameraSensitivity;
}