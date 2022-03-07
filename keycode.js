function getCodeName(key){
    var num = "1234567890"
    var chr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if(key == 13){
        return "ENTER";
    }else if(key == 16){
        return "SHIFT";
    }else if(key == 17){
        return "CTRL";
    }else if(key == 18){
        return "ALT";
    }else if(key == 8){
        return "BACKSPACE";
    }else if(key == 32){
        return "SPACE";
    }else if(key == 37){
        return "LEFT";
    }else if(key == 38){
        return "UP";
    }else if(key == 39){
        return "RIGHT";
    }else if(key == 40){
        return "DOWN";
    }else if(key >= 49 && key <= 59){
        return num.charAt(key-49)
    }else if(key >= 65 && key <= 90){
        return chr.charAt(key-65)
    }else{
        return key;
    }
}