class chunkManager{

    constructor(width, height, length, scene){

        this.WIDTH = width;
        this.HEIGHT = height;
        this.LENGTH = length;
        this.SCENE = scene;

        this.SEA_LEVEL = 79;

        this.map = [];

        for(let x = 0; x < this.WIDTH; x++){
            this.map[x] = new Array(this.HEIGHT);

            for(let y = 0; y < this.HEIGHT; y++){
                this.map[x][y] = new Array(this.LENGTH);

                for(let z = 0; z < this.LENGTH; z++){
                    this.map[x][y][z] = new chunk(x, y, z, scene);
                }
            }
        }

        this.CHUNK_SIZE = this.map[0][0][0].SIZE;
        this.CHUNK_HEIGHT = this.map[0][0][0].HEIGHT;
    }

    applyNoiseMap2(){
        let noise = this.generateDefaultNoise();

        let noiseMap;
        let stoneLevel = Math.floor(this.HEIGHT/6);
        let height = 0;

        let chunkSize = this.map[0][0][0].SIZE;

        //fill lower part of world with stone
        for(let x = 0; x < this.WIDTH; x++){
            for(let y = 0; y < stoneLevel; y++){
                for(let z = 0; z < this.LENGTH; z++){
                    this.map[x][y][z].genFill(3);
                }
            }
        }

        //for each chunk
        for(let x = 0; x < this.WIDTH; x++){
            for(let y = stoneLevel; y < this.HEIGHT; y++){
                for(let z = 0; z < this.LENGTH; z++){
                    noiseMap = noise.getChunk(x, z);

                    //for each column in each chunk
                    for(let cx = 0; cx < chunkSize; cx++){
                        for(let cz = 0; cz < chunkSize; cz++){
                                
                            height = noiseMap[cx][cz] - (y - stoneLevel) * chunkSize;

                            if(height > 0){
                                this.map[x][y][z].fillColumn(cx, cz, height, 3);
                            }
            
                        }
                    }

                }
            }
        }

    }


    generateDefaultNoise(){

        let noise1 = new noiseMap2(this.map[0][0][0].SIZE, this.WIDTH, this.HEIGHT, this.LENGTH);
        let noise2 = new noiseMap2(this.map[0][0][0].SIZE, this.WIDTH, this.HEIGHT, this.LENGTH);
        
        noise1.generate();
        for(let i = 0; i < 40; i++){
            noise1.smooth();
        }

        for(let i = 0; i < 10; i++){
            noise2.generate();
            for(let j = 0; j < 40; j++){
                noise2.smooth();
            }
            noise1.combineMap(noise2.map);
        }

        for(let i = 0; i < 20; i++){
            noise1.smooth();
        }

        return noise1;

    }


    applyDefaultGeneration(){
        let currentBlock;

        //for each chunk, add a 3 block layer of grass
        for(let x = 0; x < this.WIDTH * this.CHUNK_SIZE; x++){
            for(let y = 0; y < this.HEIGHT * this.CHUNK_HEIGHT - 1; y++){
                for(let z = 0; z < this.LENGTH * this.CHUNK_SIZE; z++){

                    currentBlock = this.getBlock(x, y, z);

                    //if the current block is stone and the block above is air
                    if(currentBlock.type === 3 && this.getBlock(x, y + 1, z).type === 0){

                        if(y <= this.SEA_LEVEL - 3){
                            //make 3 layers of sand if near possible water
                            this.setBlock(x, y + 1, z, 6);
                            this.setBlock(x, y + 2, z, 6);
                            this.setBlock(x, y + 3, z, 6);
                        } else{
                            //make 2 layers of dirt and 1 layer of grass otherwise
                            this.setBlock(x, y + 1, z, 2);
                            this.setBlock(x, y + 2, z, 2);
                            this.setBlock(x, y + 3, z, 1);
                        }
                        

                    }

                    if(currentBlock.type === 0 && y <= this.SEA_LEVEL){
                        this.setBlock(x, y, z, 7);
                    }

                }
            }
        }
    }

    generateGreedyMesh(x, y, z){
        //XN, XP, YN, YP, ZN, ZP
        let testChunk = new chunk(x, y, z, scene);
        let s = new Array(testChunk.SIZE).fill(new Array(testChunk.HEIGHT).fill(0));
        let XN;
        let XP;
        let YN;
        let YP;
        let ZN;
        let ZP;

        if(x > 0){
            XP = this.map[x - 1][y][z].getXN();
        } else{
            XP = s;
        }

        if(x < this.WIDTH - 1){
            XN = this.map[x + 1][y][z].getXP();
        } else{
            XN = s;
        }

        if(y > 0){
            YP = this.map[x][y - 1][z].getYN();
        } else{
            YP = s;
        }
        
        if(y < this.HEIGHT - 1){
            YN = this.map[x][y + 1][z].getYP();
        } else{
            YN = s;
        }

        if(z > 0){
            ZP = this.map[x][y][z - 1].getZN();
        } else{
            ZP = s;
        }
        
        if(z < this.LENGTH - 1){
            ZN = this.map[x][y][z + 1].getZP();
        } else{
            ZN = s;
        }

        this.map[x][y][z].visibleSides(XN, XP, YN, YP, ZN, ZP);
        this.map[x][y][z].generateGreedyMesh();
    }

    generateAllGreedyMeshes(){
        //XN, XP, YN, YP, ZN, ZP
        let testChunk = new chunk(x, y, z, scene);
        let s = new Array(testChunk.SIZE).fill(new Array(testChunk.HEIGHT).fill(0));
        let XN;
        let XP;
        let YN;
        let YP;
        let ZN;
        let ZP;

        for(let x = 0; x < this.WIDTH; x++){
            for(let y = 0; y < this.HEIGHT; y++){
                for(let z = 0; z < this.LENGTH; z++){

                    if(x > 0){
                        XP = this.map[x - 1][y][z].getXN();
                    } else{
                        XP = s;
                    }

                    if(x < this.WIDTH - 1){
                        XN = this.map[x + 1][y][z].getXP();
                    } else{
                        XN = s;
                    }

                    if(y > 0){
                        YP = this.map[x][y - 1][z].getYN();
                    } else{
                        YP = s;
                    }
                    
                    if(y < this.HEIGHT - 1){
                        YN = this.map[x][y + 1][z].getYP();
                    } else{
                        YN = s;
                    }

                    if(z > 0){
                        ZP = this.map[x][y][z - 1].getZN();
                    } else{
                        ZP = s;
                    }
                    
                    if(z < this.LENGTH - 1){
                        ZN = this.map[x][y][z + 1].getZP();
                    } else{
                        ZN = s;
                    }

                    this.map[x][y][z].visibleSides(XN, XP, YN, YP, ZN, ZP);
                    this.map[x][y][z].generateGreedyMesh();
                }
            }
        }
    }


    generateTrees(spawnWeight){
        let currentBlock;
        let treeHeight;

        //look at each block
        for(let x = 0; x < this.WIDTH * this.CHUNK_SIZE; x++){
            for(let y = 0; y < this.HEIGHT * this.CHUNK_HEIGHT - 1; y++){
                for(let z = 0; z < this.LENGTH * this.CHUNK_SIZE; z++){

                    currentBlock = this.getBlock(x, y, z);

                    //generate a tree on random chance
                    if(currentBlock.type === 1 && y > this.SEA_LEVEL + 4 &&Math.random() < spawnWeight){
                        //set block under tree to dirt
                        this.setBlock(x, y, z, 2);
                        treeHeight = Math.round((Math.random() * 3) + 4);

                        //generate leaves
                        for(let tx = -1; tx < 2; tx++){
                            for(let ty = -1; ty < 2; ty++){
                                for(let tz = -1; tz < 2; tz++){

                                    this.setBlock(x + tx, y + ty + treeHeight, z + tz, 5);
                                }
                            }
                        }
                        this.setBlock(x, y + treeHeight + 2, z, 5);
                        this.setBlock(x, y + treeHeight + 3, z, 5);
                        this.setBlock(x - 1, y + treeHeight + 2, z, 5);
                        this.setBlock(x + 1, y + treeHeight + 2, z, 5);
                        this.setBlock(x, y + treeHeight + 2, z - 1, 5);
                        this.setBlock(x, y + treeHeight + 2, z + 1, 5);

                        //generate tree base
                        for(let i = 1; i < treeHeight; i++){
                            this.setBlock(x, y + i, z, 4);
                        }

                    }

                }
            }
        }

    }


    setBlock(x, y, z, type){
        if(x >= this.CHUNK_SIZE * this.WIDTH || y >= this.CHUNK_HEIGHT * this.HEIGHT || z >= this.CHUNK_SIZE * this.LENGTH
            || x < 0 || y < 0 || z < 0){
            return;
        }

        let chunkX = Math.floor(x / this.CHUNK_SIZE);
        let chunkY = Math.floor(y / this.CHUNK_HEIGHT);
        let chunkZ = Math.floor(z / this.CHUNK_SIZE);

        this.map[chunkX][chunkY][chunkZ].list[x % this.CHUNK_SIZE][y % this.CHUNK_HEIGHT][z % this.CHUNK_SIZE].type = type;
    }

    getBlock(x, y, z){
        let chunkX = Math.floor(x / this.CHUNK_SIZE);
        let chunkY = Math.floor(y / this.CHUNK_HEIGHT);
        let chunkZ = Math.floor(z / this.CHUNK_SIZE);

        return this.map[chunkX][chunkY][chunkZ].list[x % this.CHUNK_SIZE][y % this.CHUNK_HEIGHT][z % this.CHUNK_SIZE];
    }

    hideChunk(chunkX, chunkY, chunkZ){
        //if the chunk is out of bounds, do nothing
        if(chunkX < 0 || chunkY < 0 || chunkZ < 0 || chunkX > this.map.length - 1 || chunkY > this.map[0].length - 1 || chunkZ > this.map[0][0].length - 1){
            return;
        }

        let c = this.map[chunkX][chunkY][chunkZ];

        for(let i = 0; i < c.sceneObjects.length; i++){
            c.sceneObjects[i].visible = false;
        }
    }

    showChunk(chunkX, chunkY, chunkZ){
        //if the chunk is out of bounds, do nothing
        if(chunkX < 0 || chunkY < 0 || chunkZ < 0 || chunkX > this.map.length - 1 || chunkY > this.map[0].length - 1 || chunkZ > this.map[0][0].length - 1){
            return;
        }

        let c = this.map[chunkX][chunkY][chunkZ];

        if(!c.meshGenerated){
            this.generateGreedyMesh(chunkX, chunkY, chunkZ);
        }

        for(let i = 0; i < c.sceneObjects.length; i++){
            c.sceneObjects[i].visible = true;
        }

    }

}