class chunkManager{

    constructor(width, height, length, scene){

        this.WIDTH = width;
        this.HEIGHT = height;
        this.LENGTH = length;
        this.SCENE = scene;

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
    }

    applyNoiseMap2(){
        let noise = new noiseMap2(this.map[0][0][0].SIZE, this.WIDTH, this.HEIGHT, this.LENGTH);
        noise.generate();
        let map1 = new noiseMap2(this.map[0][0][0].SIZE, this.WIDTH, this.HEIGHT, this.LENGTH);
        map1.generate();
        for(let i = 0; i < 15; i++){
            noise.smooth();
            map1.smooth();
        }
        noise.combineMap(map1.map);

        let noiseMap;
        let stoneLevel = Math.floor(this.HEIGHT/4);
        let height = 0;

        let chunkSize = this.map[0][0][0].SIZE;

        //fill lower part of world with stone
        for(let x = 0; x < this.WIDTH; x++){
            for(let y = 0; y < stoneLevel; y++){
                for(let z = 0; z < this.LENGTH; z++){
                    this.map[x][y][z].genFill(1);
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
                                    //console.log(cx + " " + height + " " + cz);
                                    this.map[x][y][z].fillColumn(cx, cz, height, 1);
                                }
            
                            }
                    }

                }
            }
        }

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

}