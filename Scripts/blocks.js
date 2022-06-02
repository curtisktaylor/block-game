class blocks{
    //a list of all blocks

    static BLOCK_SIZE = 5;

    static list = [
        //new typeBlock(#topColor, #sideColor, #bottomColor, visible, opacity)
        new defaultBlock("#FFFFFF", "#FFFFFF", "#FFFFFF", false, 1),//0 - air
        new defaultBlock("#60fc60", "#964B00", "#964B00", true, 1),//1 - grass #90ee90 #60fc60
        new defaultBlock("#C97E33", "#964B00", "#964B00", true, 1),//2 - dirt
        new defaultBlock("#A0A0A0", "#808080", "#808080", true, 1),//3 - stone
        new defaultBlock("#987654", "#654321", "#654321", true, 1),//4 - wood logs
        new defaultBlock("#339733", "#006400", "#006400", true, 1),//5 - leaves
        new defaultBlock("#e4d4a2", "#c2b280", "#c2b280", true, 1),//6 - sand
        new defaultBlock("#6666ff", "#00CED1", "#00CED1", true, 0.5),//7 - water (full block)
    ];

}