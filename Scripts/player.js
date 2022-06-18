class player{

    constructor(scene, camera, x, y, z, worldSizeX, worldSizeY, worldSizeZ, chunkSize, chunkHeight){

        this.visibleChunks = [];

        this.hitbox = new boxHitbox(3, 8, 3);
        //we dont want the camera to be in the middle of the hitbox so we move the hitbox down a bit
        this.hitboxYOffset = 0;

        this.renderDist = 3;

        this.camera = camera;
        this.SCENE = scene;

        this.chunkSize = chunkSize;
        this.chunkHeight = chunkHeight;

        this.worldSizeX = worldSizeX;
        this.worldSizeY = worldSizeY;
        this.worldSizeZ = worldSizeZ;


        this.trueX = x;//the true coordinates of the player in the scene
        this.trueY = y;
        this.trueZ = z;

        this.worldX = x / 5;//coordinates of player in the world
        this.worldY = y / 5;
        this.worldZ = z / 5;

        this.chunkX = Math.floor(this.worldX / 16);//what chunk the player is in
        this.chunkY = Math.floor(this.worldY / 16);
        this.chunkZ = Math.floor(this.worldZ / 16);

        this.fX = Math.floor(x / 5);//floored world coordinates
        this.fY = Math.floor(y / 5);
        this.fZ = Math.floor(z / 5);

        camera.position.x = x;
        camera.position.y = y;
        camera.position.z = z;
        

        this.cameraX = 0;//horizontal camera rotation
        this.cameraY = 0;//vertical
        this.cameraSensitivity = 0.4;

        this.turnX = 0;//what direction player is turning on horizontal axis (-1 = left, 1 = right, 0 = none)
        this.turnY = 0;//same but on vertical axis                           (-1 down, 1, up, 0, none)

        this.moveF = 0;//if player is moving forward/backward
        this.moveS = 0;//if player is moving left/right
        this.moveV = 0;//if player is moving up/down


        this.speed = 0.3;//player's speed
        this.sens = 3;//how fast camera rotates


        this.world = new chunkManager(worldSizeX, worldSizeY, worldSizeZ, scene);
        this.initWorld();


    }

    initWorld(){
        this.world.applyNoiseMap2();
        this.world.applyDefaultGeneration();
        this.world.generateTrees(0.02);
        //this.world.generateAllGreedyMeshes();
    }

    updateRenderedChunks(){
        let newChunks = [];

        //figure out what chunks are now visible
        //typically the top chunks are the laggiest to render which is why the y loop is placed oddly. It makes the chunks render as collumns rather than rows
        //which means the laggiest chunks will not try to load at the same time
        for(let x = this.chunkX - this.renderDist; x < this.chunkX + this.renderDist + 1; x++){
            for(let z = this.chunkZ - this.renderDist; z < this.chunkZ + this.renderDist + 1; z++){
                for(let y = 0; y < this.worldSizeY; y++){

                    newChunks[newChunks.length] = new THREE.Vector3(x, y, z);
                }
            }
            
        }

        if(this.visibleChunks.length === 0){
            this.visibleChunks = newChunks;
            for(let i = 0; i < newChunks.length; i++){
                this.world.queueChunk(newChunks[i].x, newChunks[i].y, newChunks[i].z);
            }
        }

        let matching = false;
        let targetChunk;
        let newChunk;

        //if a chunk that is currently visible shouldn't be because the player moved to a new chunk, make it invisible
        for(let i = 0; i < this.visibleChunks.length; i++){
            for(let j = 0; j < newChunks.length; j++){

                targetChunk = this.visibleChunks[i];
                newChunk = newChunks[j];

                if(targetChunk.x === newChunk.x && targetChunk.y === newChunk.y && targetChunk.z === newChunk.z){
                    matching = true;
                    break;
                }
            }

            if(matching){
                matching = false;
                continue;
            }

            this.world.hideChunk(targetChunk.x, targetChunk.y, targetChunk.z);
        }

        //look through each new chunk
        for(let i = 0; i < newChunks.length; i++){
            for(let j = 0; j < this.visibleChunks.length; j++){

                targetChunk = this.visibleChunks[j];
                newChunk = newChunks[i];


                if(targetChunk.x === newChunk.x && targetChunk.y === newChunk.y && targetChunk.z === newChunk.z){
                    matching = true;
                    break;
                }
            }

            //if the new chunk matches with an old one, do nothing because it should already be visible
            if(matching){
                matching = false;
                continue;
            } 

            //otherwise, make the chunk visible
            this.world.queueChunk(newChunk.x, newChunk.y, newChunk.z);

        }

        this.visibleChunks = newChunks;

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

        this.chunkX = Math.floor(this.worldX / 16);//what chunk the player is in
        this.chunkY = Math.floor(this.worldY / 16);
        this.chunkZ = Math.floor(this.worldZ / 16);

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

        this.chunkX = Math.floor(this.worldX / 16);//what chunk the player is in
        this.chunkY = Math.floor(this.worldY / 16);
        this.chunkZ = Math.floor(this.worldZ / 16);

        this.camera.position.x = this.trueX;
        this.camera.position.y = this.trueY;
        this.camera.position.z = this.trueZ;

        this.updateRenderedChunks();

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

        let distMovedH = this.move(this.speed, this.cameraX, deltaTime);//gets how far player should move forward
        //this.shiftPos(distMoved.x * this.moveF, 0, distMoved.z * this.moveF);
        distMovedH.x *= this.moveF;
        distMovedH.z *= this.moveF;

        let distMovedV = this.move(this.speed, this.cameraX + 90, deltaTime);//gets how far player should move sideways
        //this.shiftPos(distMoved.x * this.moveS, this.speed * this.moveV * deltaTime, distMoved.z * this.moveS);
        distMovedV.x *= this.moveS;
        distMovedV.z *= this.moveS;

        let distMoved = new THREE.Vector3(distMovedH.x + distMovedV.x, this.speed * this.moveV * deltaTime, distMovedH.z + distMovedV.z);

        


        this.world.chunkLoadUpdate();


        if(!this.collision(distMoved.x, 0, 0)){
            /*console.log(this.collidingWith(this.worldX, this.worldY + this.hitboxYOffset, this.worldZ, this.worldX, this.worldY, this.worldZ, 
                blocks.list[block.type]  ));*/
            //console.log(this.collision(distMoved.x, distMoved.y + this.hitboxYOffset, distMoved.z));
            this.shiftPos(distMoved.x, 0, 0);
        } else if(this.collision(distMoved.x, 0, 0)){
            distMoved.x /= 2;
            while(this.collision(distMoved.x, 0, 0)){
                distMoved.x /= 2;
                if(distMoved.x < 0.05){
                    break;
                }
            }
            if(!this.collision(distMoved.x, 0, 0)){
                this.shiftPos(distMoved.x, 0, 0);
            }
        }
        if(!this.collision(0, distMoved.y + this.hitboxYOffset, 0)){
            /*console.log(this.collidingWith(this.worldX, this.worldY + this.hitboxYOffset, this.worldZ, this.worldX, this.worldY, this.worldZ, 
                blocks.list[block.type]  ));*/
            //console.log(this.collision(distMoved.x, distMoved.y + this.hitboxYOffset, distMoved.z));
            this.shiftPos(0, distMoved.y, 0);
        }else if(this.collision(0, distMoved.y, 0)){
            distMoved.y /= 2;
            while(this.collision(0, distMoved.y, 0)){
                distMoved.y /= 2;
                if(distMoved.y < 0.05){
                    break;
                }
            }
            if(!this.collision(0, distMoved.y, 0)){
                this.shiftPos(0, distMoved.y, 0);
            }
        }
        if(!this.collision(0, 0, distMoved.z)){
            /*console.log(this.collidingWith(this.worldX, this.worldY + this.hitboxYOffset, this.worldZ, this.worldX, this.worldY, this.worldZ, 
                blocks.list[block.type]  ));*/
            //console.log(this.collision(distMoved.x, distMoved.y + this.hitboxYOffset, distMoved.z));
            this.shiftPos(0, 0, distMoved.z);
        }else if(this.collision(0, 0, distMoved.z)){
            distMoved.z /= 2;
            while(this.collision(0, 0, distMoved.z)){
                distMoved.z /= 2;
                if(distMoved.z < 0.05){
                    break;
                }
            }
            if(!this.collision(0, 0, distMoved.z)){
                this.shiftPos(0, 0, distMoved.z);
            }
        }
        
        
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

    //shiftPos but with block collision
    shiftPosCollision(x, y, z){
        
    }

    //checks if the player is colliding with a block
    collidingWith(x1, y1, z1, x2, y2, z2, blockReference){
        
        if(blockReference.collisionType === 1){
            return(this.hitbox.collidingWith(x1, y1, z1, x2, y2, z2, blockReference.hitbox));
        }

        return false;
        
    }

    //checks if a spot the player wants to move to will result in a collision
    collision(cx, cy, cz){
        let block;
        let reference;
        let tempX;
        let tempY;
        let tempZ;

        for(let x = Math.min(0, cx); x < Math.max(0, cx) + 1; x++){
            for(let y = Math.min(0, cy); y < Math.max(0, cy) + 1; y++){
                for(let z = Math.min(0, cz); z < Math.max(0, cz) + 1; z++){

                    tempX = Math.floor(Math.abs(this.worldX + x)) * Math.sign(this.worldX + x);
                    tempY = Math.floor(Math.abs(this.worldY + y)) * Math.sign(this.worldY + y);
                    tempZ = Math.floor(Math.abs(this.worldZ + z)) * Math.sign(this.worldZ + z);
                    block = this.world.getBlock(tempX, tempY, tempZ);

                    if(block === -1){
                        continue;
                    }

                    reference = blocks.list[block.type];
                        
                    if(this.collidingWith(this.worldX + cx, this.worldY + cy, this.worldZ + cz, tempX, tempY, tempZ, reference)){

                        return true;
                    }

                }
            }
        }

        return false;

    }

}