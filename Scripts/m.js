class m{
    //this is for math methods that aren't in the default Math that js provides
    
    static hexAdd(hexString, num){//adds a decimal number to a hex number
        let x = "#" + (parseInt(hexString.substring(1), 16) + num * 1118481).toString(16);
        while(x.length < 7){
            x += "0";
        }
        if(x.length > 7) return hexString;
        return x;
    }

    static rad(degree){//changes degree into radians
        return degree * (Math.PI / 180);
    }

    static deg(radian){//changes radians into degree
        return radian / (Math.PI / 180);
    }

}