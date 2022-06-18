class boxHitbox{

    constructor(width, height, length){

        //this.list = [];
        this.yMin = -height;
        this.yMax = 0;
        this.xMin = -width;
        this.xMax = 0;
        this.zMin = -length;
        this.zMax = 0;

        /*this.list[0] = new planeHitbox( //back (z-)
            new THREE.Vector3(width/2, height/2, length/2),
            new THREE.Vector3(-width/2, height/2, length/2),
            new THREE.Vector3(width/2, -height/2, length/2),
            new THREE.Vector3(-width/2, -height/2, length/2)
        );
        this.list[1] = new planeHitbox( //left (x-)
            new THREE.Vector3(width/2, height/2, length/2),
            new THREE.Vector3(width/2, height/2, -length/2),
            new THREE.Vector3(width/2, -height/2, length/2),
            new THREE.Vector3(width/2, -height/2, -length/2)
        );
        this.list[2] = new planeHitbox( //front (z+)
            new THREE.Vector3(width/2, height/2, -length/2),
            new THREE.Vector3(-width/2, height/2, -length/2),
            new THREE.Vector3(width/2, -height/2, -length/2),
            new THREE.Vector3(-width/2, -height/2, -length/2)
        );
        this.list[3] = new planeHitbox( //right (x+)
            new THREE.Vector3(-width/2, height/2, -length/2),
            new THREE.Vector3(-width/2, -height/2, length/2),
            new THREE.Vector3(-width/2, height/2, length/2),
            new THREE.Vector3(-width/2, -height/2, -length/2)
        );
        this.list[4] = new planeHitbox( //top (y+)
            new THREE.Vector3(width/2, height/2, length/2),
            new THREE.Vector3(-width/2, height/2, length/2),
            new THREE.Vector3(width/2, height/2, -length/2),
            new THREE.Vector3(-width/2, height/2, -length/2)
        );
        this.list[5] = new planeHitbox( //top (y-)
            new THREE.Vector3(width/2, -height/2, length/2),
            new THREE.Vector3(-width/2, -height/2, length/2),
            new THREE.Vector3(width/2, -height/2, -length/2),
            new THREE.Vector3(-width/2, -height/2, -length/2)
        );*/

    }

    //tests if this hitbox is colliding with another hitbox
    collidingWith(x1, y1, z1, x2, y2, z2, h){
        

        return  (this.xMin + x1 <= h.xMax + x2 && this.xMax + x1 >= h.xMin + x2) &&
                (this.yMin + y1 <= h.yMax + y2 && this.yMax + y1 >= h.yMin + y2) &&
                (this.zMin + z1 <= h.zMax + z2 && this.zMax + z1 >= h.zMin + z2);
    }

}