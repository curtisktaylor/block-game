class chunk{

    static chunkCount = 0;

    constructor(chunkX, chunkY, chunkZ, scene){

        this.SIZE = 16;//length and width of the chunk
        this.HEIGHT = 16;//height of the chunk
        this.AREA = this.SIZE * this.SIZE * this.HEIGHT;// count of how many blocks in the chunk

        this.scene = scene;

        this.list = new Array(this.SIZE);//3D array storing the block types

        this.x = chunkX;//where this chunk is relative to other chunks
        this.y = chunkY;
        this.z = chunkZ;

        //for whatever reason, you must access static vars with this.constructor.varName
        //The chunkID is used to mark planes sent to THREE.js that they come from this specific chunk so they can be deleted/hidden later
        this.chunkID = this.constructor.chunkCount;
        this.constructor.chunkCount++;

        for(let x = 0; x < this.SIZE; x++){//initializes array that holds block info
            this.list[x] = new Array(this.SIZE);

            for(let y = 0; y < this.HEIGHT; y++){
                this.list[x][y] = new Array(this.SIZE);

                for(let z = 0; z < this.SIZE; z++){
                    this.list[x][y][z] = new meshUnit();//assume everything is air
                }
            }
        }


    }

    //changes this.list[x][y][z].sides[i] so that we can see what block faces are visible
    //takes in info of adjacent chunks so that edge blocks know if they should show their faces or not. 
    //XN means negative x side of chunk, YP means positive y side of chunk, etc
    visibleSides(XN, XP, YN, YP, ZN, ZP){
        let id;//current id of the selected block in the loop
        let adjId;//current id of an adjacent block in the loop

        for(let x = 0; x < this.SIZE; x++){
            for(let y = 0; y < this.HEIGHT; y++){
                for(let z = 0; z < this.SIZE; z++){

                    id = this.getBlockID(x, y, z);

                    if(!blocks.list[id].vis){//if the block isn't visible (like if its air), move on
                        continue;
                    }

                    //**LEFT SIDE (X-)**
                    if(x === this.SIZE - 1){//if I'm at the chunk border, check the chunk to my left for info (XN array)
                        adjId = XN[z][y];
                    } else{//otherwise, just use this.getBlockID();
                        adjId = this.getBlockID(x + 1, y, z);//grabs block to my left
                    }

                    if(!blocks.list[adjId].vis || blocks.list[adjId].opacity < 1){//if the block to my left is invisible or opaque, my left face is visible. 1 === not opaque
                        this.list[x][y][z].sides[1] = true;
                    } 
                    if(!(blocks.list[id].opacity === 1) && adjId === id){//if I am opaque, my left side should NOT show if the block left of me is the same type as me. 1 === not opaque
                        this.list[x][y][z].sides[1] = false;
                    }


                    //**RIGHT SIDE (X+)**
                    if(x === 0){//if I'm at the chunk border, check the chunk to my right for info (XP array)
                        adjId = XP[z][y];
                    } else{//otherwise, just use this.getBlockID();
                        adjId = this.getBlockID(x - 1, y, z);//grabs block to my right
                    }

                    if(!blocks.list[adjId].vis || blocks.list[adjId].opacity < 1){//if the block to my right is invisible or opaque, my right face is visible. 1 === not opaque
                        this.list[x][y][z].sides[3] = true;
                    } 
                    if(!(blocks.list[id].opacity === 1) && adjId === id){//if I am opaque, my right side should NOT show if the block right of me is the same type as me. 1 === not opaque
                        this.list[x][y][z].sides[3] = false;
                    }


                    //**BACK SIDE (Z-)**
                    if(z === this.SIZE - 1){//if I'm at the chunk border, check the chunk to my back for info (ZN array)
                        adjId = ZN[x][y];
                    } else{//otherwise, just use this.getBlockID();
                        adjId = this.getBlockID(x, y, z + 1);//grabs block to my back
                    }

                    if(!blocks.list[adjId].vis || blocks.list[adjId].opacity < 1){//if the block to my back is invisible or opaque, my back face is visible. 1 === not opaque
                        this.list[x][y][z].sides[0] = true;
                    } 
                    if(!(blocks.list[id].opacity === 1) && adjId === id){//if I am opaque, my back side should NOT show if the block back of me is the same type as me. 1 === not opaque
                        this.list[x][y][z].sides[0] = false;
                    }


                    //**FRONT SIDE (Z+)**
                    if(z === 0){//if I'm at the chunk border, check the chunk to my front for info (XP array)
                        adjId = ZP[x][y];
                    } else{//otherwise, just use this.getBlockID();
                        adjId = this.getBlockID(x, y, z - 1);//grabs block to my front
                    }

                    if(!blocks.list[adjId].vis || blocks.list[adjId].opacity < 1){//if the block to my front is invisible or opaque, my front face is visible. 1 === not opaque
                        this.list[x][y][z].sides[2] = true;
                    } 
                    if(!(blocks.list[id].opacity === 1) && adjId === id){//if I am opaque, my front side should NOT show if the block front of me is the same type as me. 1 === not opaque
                        this.list[x][y][z].sides[2] = false;
                    }


                    //**BOTTOM SIDE (Y-)**
                    if(y === this.HEIGHT - 1){//if I'm at the chunk border, check the chunk to my bottom for info (XN array)
                        adjId = YN[x][z];
                    } else{//otherwise, just use this.getBlockID();
                        adjId = this.getBlockID(x, y + 1, z);//grabs block to my bottom
                    }

                    if(!blocks.list[adjId].vis || blocks.list[adjId].opacity < 1){//if the block to my bottom is invisible or opaque, my bottom face is visible. 1 === not opaque
                        this.list[x][y][z].sides[4] = true;
                    } 
                    if(!(blocks.list[id].opacity === 1) && adjId === id){//if I am opaque, my bottom side should NOT show if the block bottom of me is the same type as me. 1 === not opaque
                        this.list[x][y][z].sides[4] = false;
                    }

                    //**TOP SIDE (Y+)**
                    if(y === 0){//if I'm at the chunk border, check the chunk to my top for info (XN array)
                        adjId = YP[x][z];
                    } else{//otherwise, just use this.getBlockID();
                        adjId = this.getBlockID(x, y - 1, z);//grabs block to my top
                    }

                    if(!blocks.list[adjId].vis || blocks.list[adjId].opacity < 1){//if the block to my top is invisible or opaque, my top face is visible. 1 === not opaque
                        this.list[x][y][z].sides[5] = true;
                    } 
                    if(!(blocks.list[id].opacity === 1) && adjId === id){//if I am opaque, my top side should NOT show if the block top of me is the same type as me. 1 === not opaque
                        this.list[x][y][z].sides[5] = false;
                    }

                }
            }
        }
    }

    getXP(){//gets the blocks lining positive x border of this chunk, returns their IDs in an array
        let XP = new Array(this.SIZE * this.HEIGHT);

        for(let z = 0; z < this.SIZE; z++){
             for(let y = 0; y < this.HEIGHT; y++){
                XP[z][y] = this.getBlockID(this.SIZE - 1, y, z);
            }
         }

        return XP;
    }

    getXN(){//gets the blocks lining negative x border of this chunk, returns their IDs in an array
        let XN = new Array(this.SIZE * this.HEIGHT);

        for(let z = 0; z < this.SIZE; z++){
             for(let y = 0; y < this.HEIGHT; y++){
                XN[z][y] = this.getBlockID(0, y, z);
            }
         }
         
        return XN;
    }

    getZP(){//gets the blocks lining positive z border of this chunk, returns their IDs in an array
        let ZP = new Array(this.SIZE * this.HEIGHT);

        for(let x = 0; x < this.SIZE; x++){
             for(let y = 0; y < this.HEIGHT; y++){
                ZP[x][y] = this.getBlockID(x, y, this.SIZE - 1);
            }
         }
         
        return ZP;
    }

    getZN(){//gets the blocks lining negative z border of this chunk, returns their IDs in an array
        let ZN = new Array(this.SIZE * this.HEIGHT);

        for(let x = 0; x < this.SIZE; x++){
             for(let y = 0; y < this.HEIGHT; y++){
                ZN[x][y] = this.getBlockID(x, y, 0);
            }
         }
         
        return ZN;
    }

    getYP(){//gets the blocks lining positive y border of this chunk, returns their IDs in an array
        let YP = new Array(this.SIZE * this.SIZE);

        for(let x = 0; x < this.SIZE; x++){
             for(let z = 0; z < this.SIZE; z++){
                YP[x][z] = this.getBlockID(x, this.HEIGHT - 1, z);
            }
         }
         
        return YP;
    }

    getYN(){//gets the blocks lining negative y border of this chunk, returns their IDs in an array
        let YN = new Array(this.SIZE * this.SIZE);

        for(let x = 0; x < this.SIZE; x++){
             for(let z = 0; z < this.SIZE; z++){
                YN[x][z] = this.getBlockID(x, 0, z);
            }
         }
         
        return YN;
    }

    genRandomBlocks(){//fills the chunk with random blocks
        for(let x = 0; x < this.SIZE; x++){
            for(let y = 0; y < this.HEIGHT; y++){
                for(let z = 0; z < this.SIZE; z++){
                    this.list[x][y][z].type = Math.floor(Math.random() * 2);
                }
            }
        }
    }

    genFill(type){//fills chunk with a type of block
        for(let x = 0; x < this.SIZE; x++){
            for(let y = 0; y < this.HEIGHT; y++){
                for(let z = 0; z < this.SIZE; z++){
                    this.list[x][y][z].type = type;
                }
            }
        }
    }

    setRaw(){//adds chunk mesh into scene without greedy meshing

        let id;
        let faces;
        let geometry;
        let material;
        let worldCoord;
        let chunkOffset;
        let plane;

        for(let x = 0; x < this.SIZE; x++){
            for(let y = 0; y < this.HEIGHT; y++){
                for(let z = 0; z < this.SIZE; z++){

                    id = this.getBlockID(x, y, z);
                    //if(!blocks.list[id].visible) continue;
                    faces = blocks.list[id].faces;

                    for(let i = 0; i < faces.length; i++){
                        if(this.list[x][y][z].sides[i]){
                            //gets coordinate position of current block
                            chunkOffset = new THREE.Vector3(this.x * this.SIZE * blocks.BLOCK_SIZE, this.y * this.SIZE * blocks.BLOCK_SIZE, this.z * this.SIZE * blocks.BLOCK_SIZE);
                            worldCoord = new THREE.Vector3(x * blocks.BLOCK_SIZE, y * blocks.BLOCK_SIZE, z * blocks.BLOCK_SIZE);
                            
                            //moves the face to its exact location
                            worldCoord.x += blocks.list[id].faces[i].x + chunkOffset.x;
                            worldCoord.y += blocks.list[id].faces[i].y + chunkOffset.y;
                            worldCoord.z += blocks.list[id].faces[i].z + chunkOffset.z;

                            geometry = new THREE.PlaneGeometry( faces[i].width, faces[i].height );
                            if(blocks.list[id].opacity === 1){
                                material = new THREE.MeshBasicMaterial( { color: faces[i].color/*, side: THREE.DoubleSide */} );
                            }else{
                                material = new THREE.MeshBasicMaterial( { color: faces[i].color, transparent: true, opacity: blocks.list[id].opacity/*, side: THREE.DoubleSide */} );
                            }
                            

                            //rotates the face to the proper direction
                            geometry.rotateX(blocks.list[id].faces[i].rx);
                            geometry.rotateY(blocks.list[id].faces[i].ry);
                            geometry.rotateZ(blocks.list[id].faces[i].rz);

                            geometry.translate(worldCoord.x, worldCoord.y, worldCoord.z);
                            
                            plane = new THREE.Mesh( geometry, material );
                            plane.name = this.chunkID;

                            this.scene.add(plane);
                            geometry.dispose();
                            material.dispose();
                            //console.log(scene.children.length);
                        }
                    }

                }
            }
        }
    }


    getXLayer(layer){//returns a 2D array containing meshUnits of a layer of blocks on the x axis
        let layerList = [];//initialize the array we are eventually going to return
        for(let i = 0; i < this.SIZE; i++){
            layerList[i] = [];
        }

        for(let y = 0; y < this.HEIGHT; y++){
            for(let z = 0; z < this.SIZE; z++){
                layerList[z][y] = this.getBlock(layer, y, z);
            }
        }

        return layerList;
    }

    getYLayer(layer){//returns a 2D array containing meshUnits of a layer of blocks on the y axis
        let layerList = [];//initialize the array we are eventually going to return
        for(let i = 0; i < this.SIZE; i++){
            layerList[i] = [];
        }

        for(let x = 0; x < this.SIZE; x++){
            for(let z = 0; z < this.SIZE; z++){
                layerList[x][z] = this.getBlock(x, layer, z);
            }
        }

        return layerList;
    }

    getZLayer(layer){//returns a 2D array containing meshUnits of a layer of blocks on the z axis
        let layerList = [];//initialize the array we are eventually going to return
        for(let i = 0; i < this.SIZE; i++){
            layerList[i] = [];
        }

        for(let y = 0; y < this.HEIGHT; y++){
            for(let x = 0; x < this.SIZE; x++){
                layerList[x][y] = this.getBlock(x, y, layer);
            }
        }

        return layerList;
    }


    getBlockID(x, y, z){//returns block id for a coordinate
        return this.list[x][y][z].type;
    }

    getBlock(x, y, z){//returns a block's meshUnit object
        return this.list[x][y][z];
    }

    setBlock(x, y, z, type){//changes a block's id. Remember to regenerate the mesh after calling this
        this.list[x][y][z].type = type;
    }


    //Generates the entire greedy mesh and sends to three.js
    generateGreedyMesh(){
        let layerX;
        let layerY;
        let layerZ;
        let meshData;

        for(let i = 0; i < this.SIZE; i++){
            layerX = this.getXLayer(i);
            layerY = this.getYLayer(i);
            layerZ = this.getZLayer(i);

            //left (x-) mesh data
            meshData = this.greedyMesh(layerX, 1);

            //sending all the data to three.js
            for(let j = 0; j < meshData.length; j++){
                this.sendPlaneTest(i, meshData[j].y, meshData[j].x, meshData[j].width, meshData[j].height, meshData[j].type, 1);
            }


            //right (x+) mesh data
            meshData = this.greedyMesh(layerX, 3);

            //sending all the data to three.js
            for(let j = 0; j < meshData.length; j++){
                this.sendPlaneTest(i, meshData[j].y, meshData[j].x, meshData[j].width, meshData[j].height, meshData[j].type, 3);
            }


            //top (y+) mesh data
            meshData = this.greedyMesh(layerY, 4);

            //sending all the data to three.js
            for(let j = 0; j < meshData.length; j++){
                this.sendPlaneTest(meshData[j].x, i, meshData[j].y, meshData[j].width, meshData[j].height, meshData[j].type, 4);
            }


            //bottom (y-) mesh data
            meshData = this.greedyMesh(layerY, 5);

            //sending all the data to three.js
            for(let j = 0; j < meshData.length; j++){
                this.sendPlaneTest(meshData[j].x, i, meshData[j].y, meshData[j].width, meshData[j].height, meshData[j].type, 5);
            }


            //back (z-) mesh data
            meshData = this.greedyMesh(layerZ, 0);

            //sending all the data to three.js
            for(let j = 0; j < meshData.length; j++){
                this.sendPlaneTest(meshData[j].x, meshData[j].y, i, meshData[j].width, meshData[j].height, meshData[j].type, 0);
            }


            //front (z+) mesh data
            meshData = this.greedyMesh(layerZ, 2);

            //sending all the data to three.js
            for(let j = 0; j < meshData.length; j++){
                this.sendPlaneTest(meshData[j].x, meshData[j].y, i, meshData[j].width, meshData[j].height, meshData[j].type, 2);
            }

        }

    }


    /*
    * Returns a greedy mesh of one layer of blocks
    * Takes a reference to a 2D array representing a chunk layer
    * Takes an integer representing what block side to look at
    * Returns: An array of objects representing a rectangle with these properties:
    *           - x, y (relative coordinates)
    *           - type (block id)
    *           - width, height
    *           - rx, ry, rz (x, y, and z rotation)
    */
    greedyMesh(layerReference, side){
        let lengthData = [];
        let tempData;

        //get each piece of length data for each slice of the layer
        for(let i = 0; i < layerReference.length; i++){

            do{
                tempData = this.getLength(layerReference, side, i);
                //dont use data that doesnt help us
                if(tempData.length > 0){
                    lengthData[lengthData.length] = tempData;
                    this.markStripUsed(layerReference, side, i, tempData.start, tempData.end);
                }
            } while(tempData.length > 0);

        }

        return this.getWidth(lengthData);

    }


    /*
    * Marks the affected blocks as "used" by setting its side to not visible. Used for greedyMesh.
    * Takes a reference to a 2D array representing a chunk layer
    * Takes a "side" value to represent what side of the block is being looked at (see meshUnit class at bottom of this file)
    * Takes a start and end coordinate (single integer)
    * Takes an index number to represent what line to mark
    */
    markStripUsed(layerReference, side, index, start, end){

        for(let i = start; i < end + 1; i++){
            layerReference[index][i].sides[side] = false;
        }

    }


    /*
    * Finds how long a strip of the same blocks goes on for. Ignores blocks that aren't visible. Used for greedyMesh.
    * Takes a reference to a 2D array representing a chunk layer
    * Takes an integer representing what strip to look at
    * Takes an integer representing what side of the block to look at
    * Returns: A single object with these properties
    *           - start, end (both single integers)
    *           - length
    *           - type (block id)
    *           - index (same as index parameter, used for getWidth)
    *           - used (boolean, later used for getWidth to mark what pieces of data have been used already)
    * length = 0 if there aren't any unused/visible blocks
    */
    getLength(layerReference, side, index){
        let length = 0;
        let start = 0;
        let end = this.SIZE - 1;
        let targetID = -1;
        let block;

        for(let i = 0; i < this.SIZE; i++){
            block = layerReference[index][i];

            //if target block id has not been found and the selected block is visible
            if(targetID === -1 && block.sides[side]){
                //set the target block id to the current selected block
                targetID = block.type;
                start = i;
            }

            if(targetID !== -1 && block.type === targetID && block.sides[side]){
                length++;
            } else if(targetID !== -1){
                end = i - 1;
                break;
            }


        }

        return {
            "start": start,
            "end": end,
            "length": length,
            "index": index,
            "type": targetID,
            "used" : false
        }

    }


    /*
    * Finds the width of a strip of blocks from getLength. Used for greedyMesh.
    * Takes an array of length data from getLength
    * Data should be sorted from lowest index to highest (see getLength returning object)
    * Returns: An array of objects with these properties
    *           - width, height
    *           - x, y
    *           - type (block id)
    */
    getWidth(lengthData){
        let result = [];
        let currentIndex = 0;
        let currentWidth = 1;

        for(let i = 0; i < lengthData.length; i++){
            //if the current piece of data has already been used, continue to the next one
            if(lengthData[i].used){
                continue;
            }
            currentIndex = lengthData[i].index;

            //j loop
            for(let j = i; j < lengthData.length; j++){
                //continue if used already or if index value is lower than what we want or if differing block types are used
                if(lengthData[j].used || lengthData[j].index < currentIndex + 1 || lengthData[i].type !== lengthData[j].type){
                    continue;
                }

                //we are only looking for strips right in front of the current piece of data (aka only if currentIndex + 1 === lengthData[j].index we compare the data)
                //since the data is sorted, anything else can be assumed to be unusable for this specific piece of data
                if(lengthData[j].index > currentIndex + 1){
                    break;
                }

                //if the two data pieces are identical but one is shifted to the right, then we have what we are looking for
                //add 1 to the width and see if there is another like this
                if(lengthData[j].start === lengthData[i].start && lengthData[j].end === lengthData[i].end){
                    currentWidth++;
                    currentIndex = lengthData[j].index;
                    lengthData[j].used = true;
                    continue;
                }
            }
            //j loop

            result[result.length] = {
                "x": lengthData[i].index,
                "y": lengthData[i].start,
                "width": currentWidth,
                "height": lengthData[i].length,
                "type": lengthData[i].type
            };

            //reset for next loop iteration
            currentWidth = 1;

        }

        return result;
    }


    sendPlane(x, y, z, width, height, id, face, test){//sends a plane to THREE.js and attaches this.chunkID to it
        let faces = blocks.list[id].faces;
        let geometry;
        let material;
        let worldCoord;
        let chunkOffset;
        let plane;

        //gets coordinate position of current block
        chunkOffset = new THREE.Vector3(this.x * this.SIZE * blocks.BLOCK_SIZE, this.y * this.SIZE * blocks.BLOCK_SIZE, this.z * this.SIZE * blocks.BLOCK_SIZE);
        worldCoord = new THREE.Vector3(x * blocks.BLOCK_SIZE, y * blocks.BLOCK_SIZE, z * blocks.BLOCK_SIZE);
        
        //moves the face to its exact location
        worldCoord.x += blocks.list[id].faces[face].x  + chunkOffset.x + ((width * blocks.BLOCK_SIZE) / 2) - blocks.BLOCK_SIZE/2;
        worldCoord.y += blocks.list[id].faces[face].y + chunkOffset.y;
        worldCoord.z += blocks.list[id].faces[face].z + chunkOffset.z + ((height * blocks.BLOCK_SIZE) / 2) - blocks.BLOCK_SIZE/2;

        geometry = new THREE.PlaneGeometry( width * blocks.BLOCK_SIZE, height * blocks.BLOCK_SIZE );
        if(blocks.list[id].opacity === 1){
            material = new THREE.MeshBasicMaterial( { color: faces[face].color/*, side: THREE.DoubleSide */} );
        }else{
            material = new THREE.MeshBasicMaterial( { color: faces[face].color, transparent: true, opacity: blocks.list[id].opacity/*, side: THREE.DoubleSide */} );
        }
        if(test != null && test){
            material = new THREE.MeshBasicMaterial( { color: Math.random() * 1000, side: THREE.DoubleSide} );
        }
        

        //rotates the face to the proper direction
        geometry.rotateX(blocks.list[id].faces[face].rx);
        geometry.rotateY(blocks.list[id].faces[face].ry);
        geometry.rotateZ(blocks.list[id].faces[face].rz);

        geometry.translate(worldCoord.x, worldCoord.y, worldCoord.z);
        
        plane = new THREE.Mesh( geometry, material );
        plane.name = this.chunkID;

        this.scene.add(plane);
        geometry.dispose();
        material.dispose();
        //console.log(scene.children.length);
    }


    sendPlaneTest(x, y, z, width, height, id, face){
        let faces = blocks.list[id].faces;
        let geometry;
        let material;
        let worldCoord;
        let chunkOffset;
        let plane;

        //gets coordinate position of current block
        chunkOffset = new THREE.Vector3(this.x * this.SIZE * blocks.BLOCK_SIZE, this.y * this.SIZE * blocks.BLOCK_SIZE, this.z * this.SIZE * blocks.BLOCK_SIZE);
        worldCoord = new THREE.Vector3(x * blocks.BLOCK_SIZE, y * blocks.BLOCK_SIZE, z * blocks.BLOCK_SIZE);

        worldCoord.x += faces[face].x + chunkOffset.x;
        worldCoord.y += faces[face].y + chunkOffset.y;
        worldCoord.z += faces[face].z + chunkOffset.z;

        if(face === 3 || face === 1){
            worldCoord.y += ((height - 1) * blocks.BLOCK_SIZE) / 2;
            worldCoord.z += ((width - 1) * blocks.BLOCK_SIZE) / 2;
        } 
        else if(face === 0 || face === 2){
            worldCoord.x += ((width - 1) * blocks.BLOCK_SIZE) / 2;
            worldCoord.y += ((height - 1) * blocks.BLOCK_SIZE) / 2;
        }
        else if(face === 4 || face === 5){
            worldCoord.x += ((width - 1) * blocks.BLOCK_SIZE) / 2;
            worldCoord.z += ((height - 1) * blocks.BLOCK_SIZE) / 2;
        }

        geometry = new THREE.PlaneGeometry( width * blocks.BLOCK_SIZE, height * blocks.BLOCK_SIZE );

        if(blocks.list[id].opacity === 1){
            material = new THREE.MeshBasicMaterial( { color: faces[face].color/*, side: THREE.DoubleSide */} );
        }else{
            material = new THREE.MeshBasicMaterial( { color: faces[face].color, transparent: true, opacity: blocks.list[id].opacity/*, side: THREE.DoubleSide */} );
        }
        //material = new THREE.MeshBasicMaterial( { color: Math.random() * 1000, side: THREE.DoubleSide} );

        //rotates the face to the proper direction
        geometry.rotateX(faces[face].rx);
        geometry.rotateY(faces[face].ry);
        geometry.rotateZ(faces[face].rz);

        geometry.translate(worldCoord.x, worldCoord.y, worldCoord.z);
        
        plane = new THREE.Mesh( geometry, material );
        plane.name = this.chunkID;

        this.scene.add(plane);
        geometry.dispose();
        material.dispose();

    }


    removeAllFromScene(){//removes this entire chunk from the scene
        let selectedObject = this.scene.getObjectByName(this.chunkID);

        while(selectedObject != null){
            this.scene.remove(selectedObject);
            selectedObject = this.scene.getObjectByName(this.chunkID);
        }
    }




}

class meshUnit{//data storage on block info - block type and visibility of each face

    constructor(){
        this.type = 0;//type of block - assumes block is air at first
        this.sides = new Array(6).fill(false);//stores what faces are visible - assumes no sides are visible at first
        /*
        0: back    z-
        1: left    x-
        2: front   z+
        3: right   x+
        4: top     y+
        5: bottom  y-
        */
    }

}
