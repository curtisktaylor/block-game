class player{

    constructor(camera, x, y, z){

        this.camera = camera;


        this.trueX = x;//the true coordinates of the player in the scene
        this.trueY = y;
        this.trueZ = z;

        this.worldX = x / 5;//coordinates of player in the world
        this.worldY = y / 5;
        this.worldZ = z / 5;

        this.fX = Math.floor(x / 5);//floored world coordinates
        this.fY = Math.floor(y / 5);
        this.fZ = Math.floor(z / 5);

        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        

        this.cameraX = 0;//horizontal camera rotation
        this.cameraY = 0;//vertical

        this.turnX = 0;//what direction player is turning on horizontal axis (-1 = left, 1 = right, 0 = none)
        this.turnY = 0;//same but on vertical axis                           (-1 down, 1, up, 0, none)

        this.moveF = 0;//if player is moving forward/backward
        this.moveS = 0;//if player is moving left/right
        this.moveV = 0;//if player is moving up/down


        this.speed = 2;//player's speed
        this.sens = 3;//how fast camera rotates


    }

    setPos(x, y, z){//input true coordinates, updates other position variables

        this.trueX = x;//the true coordinates of the player in the scene
        this.trueY = y;
        this.trueZ = z;

        this.worldX = x / 5;//coordinates of player in the world
        this.worldZ = y / 5;
        this.worldZ = z / 5;

        this.fX = Math.floor(x / 5);//floored world coordinates
        this.fY = Math.floor(y / 5);
        this.fZ = Math.floor(z / 5);

        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;


    }

    shiftPos(x, y, z){//shifts current positions and updates all variables

        this.trueX += x;//the true coordinates of the player in the scene
        this.trueY += y;
        this.trueZ += z;

        this.worldX += x / 5;//coordinates of player in the world
        this.worldY += y / 5;
        this.worldZ += z / 5;

        this.fX = Math.floor(this.worldX);//floored world coordinates
        this.fY = Math.floor(this.worldY);
        this.fZ = Math.floor(this.worldZ);

        this.camera.position.x = this.trueX;
        this.camera.position.y = this.trueY;
        this.camera.position.z = this.trueZ;


    }

    updateMove(camera, deltaTime){

        this.cameraX += (this.sens * this.turnX) * deltaTime;//update rotation of camera
        this.cameraY += (this.sens * this.turnY) * deltaTime;
        if(this.cameraX < 0){
            this.cameraX += 360;
        }
        if(this.cameraX > 360){
            this.cameraX -= 360;
        }
        if(this.cameraY > 89){
            this.cameraY = 89;
        }
        if(this.cameraY < -89){
            this.cameraY = -89;
        }

        camera.lookAt(this.findBlock(this.trueX, this.trueY, this.trueZ, this.cameraX, this.cameraY));//sets camera rotation

        let distMoved = this.move(this.speed, this.cameraX, deltaTime);//gets how far player should move forward
        this.shiftPos(distMoved.x * this.moveF, 0, distMoved.z * this.moveF);

        distMoved = this.move(this.speed, this.cameraX + 90, deltaTime);//gets how far player should move sideways
        this.shiftPos(distMoved.x * this.moveS, this.speed * this.moveV * deltaTime, distMoved.z * this.moveS);
        
    }

    //TODO: make this not poop code
    findBlock(x1, y1, z1, angleH, angleV){//an imaginary block placed infront of camera, so that turning using camera.lookAt(x, y, z) is possible
        let offset = Math.cos(m.rad(angleV))
        let x = x1 + offset * Math.cos(m.rad(angleH));
        let y = y1 + Math.sin(m.rad(angleV));
        let z = z1 + offset * Math.sin(m.rad(angleH));

        return new THREE.Vector3(x, y, z);
    }

    move(dist, angle, dt){//returns change in x and z coordinates from moving "dist" units forward from camera. dt is deltatime
        let x = dist * Math.cos(m.rad(angle));
        let z = dist * Math.sin(m.rad(angle));

        return new THREE.Vector3(x * dt, 0, z * dt);
    }

}