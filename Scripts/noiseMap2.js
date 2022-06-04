class noiseMap2{

    constructor(chunkSize, worldWidth, worldHeight, worldLength){

        this.SIZE = chunkSize;
        this.WIDTH = worldWidth;
        this.HEIGHT = worldHeight;
        this.LENGTH = worldLength;

        this.map = [];

    }


    //generate a 2d noise map
    generate(){

        //generate initial values
        for(let x = 0; x < this.WIDTH * this.SIZE; x++){
            this.map[x] = new Array(this.LENGTH);

            for(let z = 0; z < this.LENGTH * this.SIZE; z++){
                this.map[x][z] = Math.round(Math.random() * (this.HEIGHT * this.SIZE));
            }
        }

    }


    //smooth the noise map out
    smooth(){
        let samples = [];
        let sum = 0;
        let newMap = [];

        for(let x = 0; x < this.WIDTH * this.SIZE; x++){
            newMap[x] = new Array(this.LENGTH);

            for(let z = 0; z < this.LENGTH * this.SIZE; z++){
                newMap[x][z] = 0;
            }
        }

        //smoothing
        for(let x = 0; x < this.WIDTH * this.SIZE; x++){
            for(let z = 0; z < this.LENGTH * this.SIZE; z++){

                samples[samples.length] = this.map[x][z];

                //get samples from neighboring blocks
                if(x > 0){
                    samples[samples.length] = this.map[x - 1][z];
                }
                if(x < this.WIDTH * this.SIZE - 1){
                    samples[samples.length] = this.map[x + 1][z];
                }
                if(z > 0){
                    samples[samples.length] = this.map[x][z - 1];
                }
                if(z < this.LENGTH * this.SIZE - 1){
                    samples[samples.length] = this.map[x][z + 1];
                }

                //average value of all samples
                for(let i = 0; i < samples.length; i++){
                    sum += samples[i];
                }

                newMap[x][z] = Math.floor(sum / samples.length);
                sum = 0;
                samples = [];

            }
        }

        this.map = newMap;
    }


    //grabs a chunk segment from the noise map
    getChunk(xChunk, zChunk){
        let result = [];

        for(let x = 0; x < this.SIZE; x++){
            result[x] =  new Array(this.SIZE);

            for(let z = 0; z < this.SIZE; z++){
                result[x][z] = this.map[(xChunk) * this.SIZE + x][(zChunk) * this.SIZE + z];
            }
        }

        return result;
    }


    combineMap(map){

        for(let x = 0; x < this.WIDTH * this.SIZE; x++){
            for(let z = 0; z < this.LENGTH * this.SIZE; z++){
                this.map[x][z] = (this.map[x][z] + map[x][z]) / 2;
            }
        }

    }



}