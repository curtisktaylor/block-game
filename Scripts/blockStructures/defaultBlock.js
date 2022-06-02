class defaultBlock{

    //default structure for a block, with faces oriented to form a cube
    constructor(topColor, sideColor, bottomColor, visibility, opacity){
        this.faces = [];

        this.faces[0] = new face(0, 0, 2.5,   0, 0, 0,           m.hexAdd(sideColor, 1), 5, 5);     //back (z-)
        this.faces[1] = new face(2.5, 0, 0,   0, m.rad(90), 0,   sideColor, 5, 5);                  //left (x-)
        this.faces[2] = new face(0, 0, -2.5,  m.rad(180), 0, 0,  m.hexAdd(sideColor, 1), 5, 5);     //front (z+)
        this.faces[3] = new face(-2.5, 0, 0,  0, -m.rad(90), 0,  sideColor, 5, 5);                  //right (x+)
        this.faces[4] = new face(0, 2.5, 0,   -m.rad(90), 0, 0,  topColor, 5, 5);                   //top (y+)
        this.faces[5] = new face(0, -2.5, 0,  m.rad(90), 0, 0,   m.hexAdd(bottomColor, 2), 5, 5);   //bottom (y-)

        this.vis = visibility;//if the block is visible or not
        this.opacity = opacity;//how opaque the block is
    }

}