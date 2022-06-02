let xCoord = document.getElementById("x");
let yCoord = document.getElementById("y");
let zCoord = document.getElementById("z");
let currentChunk = document.getElementById("chunk");
let canvas = document.getElementById("canvas");

let width = window.innerWidth;
let height = window.innerHeight;

let scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xadd8e6, 0.004);
scene.background = new THREE.Color(0xadd8e6);
let camera = new THREE.PerspectiveCamera( 80, width / height, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer({antialias: false, canvas: canvas});
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

let testChunk = new chunk(1, 0, 0, scene);
let x = new Array(testChunk.SIZE).fill(new Array(testChunk.HEIGHT).fill(0));
testChunk.genFill(1);
//testChunk.genRandomBlocks();
testChunk.visibleSides(x, x, x, x, x, x);
testChunk.markStripUsed(testChunk.getXLayer(0), 3, 1, 0, 3);
testChunk.setRaw();

let lastUpdate = Date.now();

let p = new player(camera, 0, 0, 0);
setInterval(animate, 1000/60);

//testChunk.greedyMesh();
testChunk.sendPlane(0, 0, 0, 1, 1, 1, 4);
testChunk.sendPlane(0, 1, 0, 1, 1, 7, 4);
testChunk.sendPlane(0, 1, 0, 1, 1, 7, 1);
testChunk.sendPlane(0, 1, 0, 1, 1, 7, 0);
//console.log(testChunk.getBlock(0, 0, 0));

console.log(testChunk.getLength(testChunk.getXLayer(0), 3, 1));
testChunk.markTest();

function animate() {

    let now = Date.now();
    let deltaTime = (now - lastUpdate) / (1000/60);
    lastUpdate = now;

    //chunk.innerHTML = "Chunk: " + p.chunk;

    document.getElementById("fps").innerHTML = "FPS: " + Math.floor(60 / deltaTime);

    xCoord.innerHTML = "X: " + Math.round(camera.position.x)/5;
    yCoord.innerHTML = "Y: " + Math.round(camera.position.y)/5;
    zCoord.innerHTML = "Z: " + Math.round(camera.position.z)/5;

    //requestAnimationFrame( animate );
    renderer.render( scene, camera );
    
    p.updateMove(camera, deltaTime);
    
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