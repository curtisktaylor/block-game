class planeHitbox{

    constructor(c1, c2, c3, c4){
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
        this.c4 = c4;
    }

    maxX(){
        return Math.max(this.c1.x, this.c2.x, this.c3.x, this.c4.x);
    }
    minX(){
        return Math.min(this.c1.x, this.c2.x, this.c3.x, this.c4.x);
    }

    maxY(){
        return Math.max(this.c1.y, this.c2.y, this.c3.y, this.c4.y);
    }
    minY(){
        return Math.min(this.c1.y, this.c2.y, this.c3.y, this.c4.y);
    }

    maxZ(){
        return Math.max(this.c1.z, this.c2.z, this.c3.z, this.c4.z);
    }
    minZ(){
        return Math.min(this.c1.z, this.c2.z, this.c3.z, this.c4.z);
    }

}