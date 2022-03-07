window.onload = function(){
    init();
}

const CELL_SIZE = 24;

const MODESELECT = 0;
const SETTING = 1;
const GAMING = 2;
const PAUSE = 3;
const GAMEOVER = 4;
const KEYCONFIG = 5;
const CLEAROVER = 6;

const STANDARD = 0;
const LINEATTACK = 1;
const TIMEATTACK = 2;
const GRANDMASTER = 3;
const KCONFIG = 4;

let nowmode = 0;    //0 モード 1 設定 2 ゲーム 3 ポーズ 4 ゲームオーバー(リザルト) 5 キーコンフィグ
let gamemode = 0;   //0 スタンダード 1 ラインアタック 2 スコアアタック 3 グランドマスター 4 キーコンフィグ

let pind = 0;

//操作用
let keyindex = 0;

let LEFTKEY = 37;   // 左移動
let RIGHTKEY = 39;  // 右移動
let SOFTKEY = 40;   // ソフトドロップ
let HARDKEY = 32;   // ハードドロップ
let RSPINKEY = 38;  // 右回転
let LSPINKEY = 90;  // 左回転
let HOLDKEY = 67;   // ホールド

/*
let LEFTKEY = getCookie("LEFT");   // 左移動
let RIGHTKEY = getCookie("RIGHT");  // 右移動
let SOFTKEY = getCookie("SOFT");   // ソフトドロップ
let HARDKEY = getCookie("HARD");   // ハードドロップ
let RSPINKEY = getCookie("RSPIN");  // 右回転
let LSPINKEY = getCookie("LSPIN");   // 左回転
let HOLDKEY = getCookie("HARD");   // ホールド
*/
let waiting = false;

//操作用終わり

//設定用
let index = 0;
// 0 各設定 1 以下
let nextCnt = 3;    // ネクストの数
let ghost = true;   // ゴーストブロックの有無
let nextMode = 1;   // 0 ランダム 1 7個1巡
let canhold = true;
//設定用終わり

let first = false;  // 開始して最初に処理するべきものか
let surf;// = document.getElementById("surf");
let ctx;// = surf.getContext("2d");

let startLevel = 1;

let score = 0;  // スコア
let lines = 0;  // ライン数
let level = 1;  // レベル
let grandLV = 0;    // グランドマスター用レベル

let nextEX = 10;

let setNorma = 0;
let minIndex = 0;
let setMin;

let normaLine = 50; // ノルマライン

let hour = 0;   //
let minute = 0; // 
let second = 0; // 
let mili = 0;   //

let TAmin = 3;  // TA 用
let TAsec = 0;  // TA 用
let TAmili = 0; // TA 用

let timeID = null;

let single = 0; // シングル
let double = 0; // ダブル
let triple = 0; // トリプル
let tetris = 0; // テトリス

let total = 0;  // ライン消し計

let fall;   // 落下までの時間
let idle;   // 遊び時間
let fallT = 0;  // 落下カウンタ
let idleT = 0;  // 遊びカウンタ
let g;  // 落下マス
let gCount; // G カウンタ

let normalF;    // 通常時の落下時間
let softF;  // ソフトドロップ時の落下時間
let normalG;
let softG;
let resetCnt = 0;   // 遊びをリセットした数

let landing;
let spined = false; // 回転したか

var left = 3;
var right = -1;
var up = 3;
var down = -1;

let soft = false;   // ソフトドロップフラグ
let hard = false;   // ハードドロップフラグ
let hardK = 0;  // ハードドロップキーが押されたか

let minoData = new Array();   // テトリミノのデータ
let fallMino = new Array();   // 落下中のテトリミノ

let field = new Array();
let drawF = new Array();

let efc = 255;  // エフェクトの色
let effectT = 0;    // ライン消去エフェクトにかかる時間
let erasing = false;

let x, y;   // テトリミノの現在座標
let px, py; // テトリミノの前回座標

let lineEffect = 0; // どんな消し方かを示すエフェクト用(番号はライン数)

let allClear = false;
let allClearEffect = 0; // 全消し時のエフェクト

let tspin = false;  // T-Spin が成立しているか
let tspinEffect = 0;    // T-Spin 成立を示すエフェクト

let effectScore = 0;

let backtoback = false;
let eback = false;

let gx, gy; // TLS 座標
let direc;  // テトリミノの方向
let prevD;  // テトリミノの前回方向

let nowMino = 0;    //現在操作中のテトリミノ
let next = new Array(); // ネクストミノID
let spawned = new Array();  // 7個1巡用
let hold;   // ホールドミノID
let holded = false;  // そのターン中、すでにホールドしたか

let pauseK = 0;

let overTime = 0;


function init(){
    setMin = [3,5,8];
    surf = document.getElementById("surf");
    ctx = surf.getContext("2d");
    minoData = [
        [
            [
                [1,1,0],
                [0,1,1],
                [0,0,0]
            ],//0
            [
                [0,0,1],
                [0,1,1],
                [0,1,0]
            ],//1
            [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ],//2
            [
                [0,1,0],
                [1,1,0],
                [1,0,0]
            ]//3
        ],//Z
        [
            [
                [0,0,2],
                [2,2,2],
                [0,0,0]
            ],//0
            [
                [0,2,0],
                [0,2,0],
                [0,2,2]
            ],//1
            [
                [0,0,0],
                [2,2,2],
                [2,0,0]
            ],//2
            [
                [2,2,0],
                [0,2,0],
                [0,2,0]
            ]//3
        ],//L
        [
            [
                [3,3],
                [3,3]
            ],//0
            [
                [3,3],
                [3,3]
            ],//1
            [
                [3,3],
                [3,3]
            ],//2
            [
                [3,3],
                [3,3]
            ]//3
        ],//O
        [
            [
                [0,4,4],
                [4,4,0],
                [0,0,0]
            ],//0
            [
                [0,4,0],
                [0,4,4],
                [0,0,4]
            ],//1
            [
                [0,0,0],
                [0,4,4],
                [4,4,0]
            ],//2
            [
                [4,0,0],
                [4,4,0],
                [0,4,0]
            ]//3
        ],//S
        [
            [
                [0,0,0,0],
                [5,5,5,5],
                [0,0,0,0],
                [0,0,0,0]
            ],//0
            [
                [0,0,5,0],
                [0,0,5,0],
                [0,0,5,0],
                [0,0,5,0]
            ],//1
            [
                [0,0,0,0],
                [0,0,0,0],
                [5,5,5,5],
                [0,0,0,0]
            ],//2
            [
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0],
                [0,5,0,0]
            ]//3
        ],//I
        [
            [
                [6,0,0],
                [6,6,6],
                [0,0,0]
            ],//0
            [
                [0,6,6],
                [0,6,0],
                [0,6,0]
            ],//1
            [
                [0,0,0],
                [6,6,6],
                [0,0,6]
            ],//2
            [
                [0,6,0],
                [0,6,0],
                [6,6,0]
            ]//3
        ],//J
        [
            [
                [0,7,0],
                [7,7,7],
                [0,0,0]
            ],//0
            [
                [0,7,0],
                [0,7,7],
                [0,7,0]
            ],//1
            [
                [0,0,0],
                [7,7,7],
                [0,7,0]
            ],//2
            [
                [0,7,0],
                [7,7,0],
                [0,7,0]
            ]//3
        ],//T
    ];

    field = [
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//24(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//23(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//22(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//21(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//20
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//19
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//18
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//17
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//16
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//15
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//14
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//13
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//12
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//11
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//10
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//9
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//8
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//7
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//6
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//5
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//4
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//3
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//2
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//1
        [0,8,8,8,8,8,8,8,8,8,8,8,8,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0]//-1
    ];

    for(var i = 0; i < field.length; i++){
        drawF[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    for(var h = 0; h < field.length; h++){
        for(var w = 0; w < field[h].length; w++){
            drawF[h][w] = field[h][w];
        }
    }
    //gameInit();
    setInterval(update,15);
}

function update(){
    //console.log(fallT);
    if(nowmode == GAMING){
        resetField();
        downMino();
        setMino();
        if(erasing){
            efc -= 15;
            if(efc < 0){
                efc = 0;
            }
            effectT ++;
            if(effectT >= 30){
                eraseLine();
                effectT = 0;
            }
        }else{
            efc = 255;
        }

        if(allClearEffect > 0){
            allClearEffect--;
        }

        if(tspinEffect > 0){
            tspinEffect --;
        }

        let spawnNum = 0;
        for(let ed = 0; ed < 7; ed++){
            if(spawned[ed]){
                spawnNum ++;
            }
        }
        if(spawnNum >= 7){
            for(let ed = 0; ed < 7; ed++){
                spawned[ed] = false;
            }
        }
    }

    draw();
}

function draw(){
    ctx.clearRect(0,0,surf.width,surf.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,surf.width,surf.height);
    
    for(var h = 0; h < 22; h++){
        for(var w = 1; w < 13; w++){
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(152+(24*w),49+(24*(h+3)),23,23);
        }
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(152+48,48+48,240,529);

    if(gamemode == TIMEATTACK){
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "end";
        ctx.fillText("TIME "+("00"+TAmin).slice(-2)+":"+("00"+TAsec).slice(-2)+"."+("00"+(Math.round(TAmili/60 * 100))).slice(-2),640-48,48);
        ctx.textAlign = "start";
    }else{
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "end";
        ctx.fillText("TIME "+("00"+hour).slice(-2)+":"+("00"+minute).slice(-2)+":"+("00"+second).slice(-2),640-48,48);
        ctx.textAlign = "start";
    }

    if(nowmode == MODESELECT)   selectDraw();
    else if(nowmode == SETTING) setDraw();
    else if(nowmode == GAMING)  gameDraw();
    else if(nowmode == PAUSE)   pauseDraw();
    else if(nowmode == GAMEOVER)    overDraw();
    else if(nowmode == KEYCONFIG)   configDraw();
    else if(nowmode == CLEAROVER)   gclearDraw();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15pt sans-selif";
    ctx.fillText("SCORE:"+score,48,48);
	if(gamemode != LINEATTACK)	ctx.fillText("LINES:"+lines,48,72);
	else ctx.fillText("LINES:"+lines+" / "+normaLine,48,72);
    if(gamemode != GRANDMASTER) ctx.fillText("LEVEL:"+level,48,96);
    else ctx.fillText("LEVEL:"+grandLV,48,96)

    // ネクスト
    ctx.fillText("NEXT",490,168);
    ctx.fillText("HOLD",72,168);
}

function selectDraw(){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15pt sans-selif";
    ctx.fillRect(208,246+(32*(gamemode)),15,15);
    ctx.fillText("スタンダード",232,260)
    ctx.fillText("ラインアタック",232,292)
    ctx.fillText("タイムアタック",232,324)
    ctx.fillText("グランドマスター",232,356)
    //ctx.fillText("キーコンフィグ",232,388)
}

function setDraw(){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15pt sans-selif";
    ctx.fillRect(208,246+(32*(index)),15,15);
    let gIO, hIO;
    if(ghost)   gIO = "ON";
    else    gIO = "OFF";

    if(canhold) hIO = "ON";
    else    hIO = "OFF";
    let nmode = ["ランダム","7個1巡"];
    if(gamemode == STANDARD){
        ctx.fillText("レベル："+startLevel,232,260)
        ctx.fillText("ネクストの数："+nextCnt,232,292)
        ctx.fillText("ゴーストの有無："+gIO,232,324)
        ctx.fillText("ネクスト："+nmode[nextMode],232,356)
        ctx.fillText("ホールド："+hIO,232,388)
    }else if(gamemode == LINEATTACK){
        ctx.fillText("レベル："+startLevel,232,260)
        ctx.fillText("ライン数："+((setNorma+1) * 50),232,292)
        ctx.fillText("ネクストの数："+nextCnt,232,324)
        ctx.fillText("ゴーストの有無："+gIO,232,356)
        ctx.fillText("ネクスト："+nmode[nextMode],232,388)
        ctx.fillText("ホールド："+hIO,232,420)
    }else if(gamemode == TIMEATTACK){
        ctx.fillText("レベル："+startLevel,232,260)
        ctx.fillText("タイム："+setMin[minIndex]+"分",232,292)
        ctx.fillText("ネクストの数："+nextCnt,232,324)
        ctx.fillText("ゴーストの有無："+gIO,232,356)
        ctx.fillText("ネクスト："+nmode[nextMode],232,388)
        ctx.fillText("ホールド："+hIO,232,420)
    }else if(gamemode == GRANDMASTER){
        ctx.fillText("ネクストの数："+nextCnt,232,260)
        ctx.fillText("ゴーストの有無："+gIO,232,292)
        ctx.fillText("ネクスト："+nmode[nextMode],232,324)
        ctx.fillText("ホールド："+hIO,232,356)
    }
}

function gameDraw(){
    let warn = 0;
    for(var h = 0; h < field.length; h++){
        for(var w = 2; w < 12; w++){
            if(field[h][w] != 0){
                warn = h;
            }
        }
        if(warn != 0){
            break;
        }
    }
    if(warn >= 12){
        ctx.fillStyle = "#005000";
    }else if(warn < 12 && warn >= 8){
        ctx.fillStyle = "#505000"
    }else if(warn < 8){
        ctx.fillStyle = "#502800"
    }
    ctx.fillRect(152+48,48+96,241,481);
    ctx.fillStyle = "#000000";
    for(var h = 0; h < drawF.length; h++){
        for(var w = 0; w < drawF[h].length; w++){
            if(drawF[h][w] == 0){
                ctx.fillRect(152+(24*w),48+(24*h+1),23,23);
            }
        }
    }
    if(ghost)   ghostFunc();
    for(var h = 0; h < drawF.length; h++){
        for(var w = 0; w < drawF[h].length; w++){
            //0 Air 1 Red 2 Orange 3 Yellow 4 Green 5 Cyan 6 Blue 7 Purple 8 Wall 9 Effect
            if(drawF[h][w] != 0){
                switch(drawF[h][w]){
                    //case 0:
                    //    ctx.fillStyle = "#000000";
                    //    break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        if(tspinEffect <= 0) ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        else ctx.fillStyle = "rgb("+efc+",0,"+efc+")";
                        break;
                }
                
                if(h > 2){
                    ctx.fillRect(152+(24*w),48+(24*h+1),23,23);
                }
            }
        }
    }

    ctx.fillStyle = "#FFFFFF";
    if(tspinEffect > 0){
        ctx.fillText("T-Spin!",72,480);
    }

    if(allClearEffect > 0){
        ctx.fillText("PERFECT",490,480);
        ctx.fillText("CLEAR!!",490,500);
    }

    if(erasing){
        var multiPlier;
        if(gamemode == STANDARD || gamemode == GRANDMASTER){
            if(level >= 0 && level < 3){
                multiPlier = 1;
            }else if(level >= 3 && level < 5){
                multiPlier = 2;
            }else if(level >= 5 && level < 7){
                multiPlier = 3;
            }else if(level >= 7 && level < 9){
                multiPlier = 4;
            }else if(level >= 9 && level < 14){
                multiPlier = 5;
            }else if(level >= 14 && level < 20){
                multiPlier = 7;
            }else if(level >= 20){
                multiPlier = 10;
            }
        }else{
            multiPlier = 1;
        }

        var eraseType = "";
        switch(lineEffect){
            case 1:
                eraseType = "SINGLE "
                break;
            case 2:
                eraseType = "DOUBLE "
                break;
            case 3:
                eraseType = "TRIPLE "
                break;
            case 4:
                eraseType = "TETRIS "
                break;
        }
        if(tspin){
            eraseType = "T-Spin " + eraseType;
        }
        if(eback){
            eraseType = "Back to back " + eraseType;
        }
        if(allClear){
            eraseType = "PERFECT "+eraseType;
        }
        ctx.fillText(eraseType+effectScore+"PTS.",176,680);

    }
    /*
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15pt sans-selif";
    ctx.fillText("SCORE:"+score,48,48);
    ctx.fillText("LINES:"+lines,48,72);
    ctx.fillText("LEVEL:"+level,48,96);

    // ネクスト
    ctx.fillText("NEXT",490,168);
    ctx.fillText("HOLD",72,168);
    */
    for(var n = 0; n < nextCnt; n++){
        for(var h = 0; h < minoData[next[n]][0].length; h++){
            for(var w = 0; w < minoData[next[n]][0][h].length; w++){
                switch(minoData[next[n]][0][h][w]){
                    case 0:
                        ctx.fillStyle = "#000000";
                        break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        break;
                }
                ctx.fillRect(480+(24*w),192+(24*h)+(64*n),23,23);
                //minoData[n][0][h][w];
            }
        }
    }
    if(hold != -1){
        for(var h = 0; h < minoData[hold][0].length; h++){
            for(var w = minoData[hold][0][h].length-1; w >= 0; w--){
                switch(minoData[hold][0][h][w]){
                    case 0:
                        ctx.fillStyle = "#000000";
                        break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        break;
                }
                ctx.fillRect(64+(24*w),192+(24*h),23,23);
                //minoData[n][0][h][w];
            }
        }
    }
}

function pauseDraw(){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15pt sans-selif";
    ctx.fillText("PAUSE",282,353);

    ctx.fillRect(208,486+(32*(pind)),15,15);
    ctx.fillText("RESUME",232,500);
    ctx.fillText("QUIT",232,532);
}

function overDraw(){
    clearInterval(timeID)
    if(overTime <= 60){
    ctx.fillStyle = "#500000";
    ctx.fillRect(152+48,48+96,241,481);
    }
    ctx.fillStyle = "#000000";
    for(var h = 0; h < drawF.length; h++){
        for(var w = 0; w < drawF[h].length; w++){
            if(drawF[h][w] == 0){
                ctx.fillRect(152+(24*w),48+(24*h+1),23,23);
            }
        }
    }
    
        for(var h = 0; h < drawF.length; h++){
            for(var w = 0; w < drawF[h].length; w++){
                //0 Air 1 Red 2 Orange 3 Yellow 4 Green 5 Cyan 6 Blue 7 Purple 8 Wall 9 Effect
                if(drawF[h][w] != 0){
                    if(drawF[h][w] == 8){
                        ctx.fillStyle = "#FFFFFF";   
                    }else{
                        ctx.fillStyle = "#505050";
                    }
                    if(h > 2){
                        if(drawF[h][w] == 8 || overTime <= 60){
                            ctx.fillRect(152+(24*w),48+(24*h+1),23,23);
                        }
                    }
                }
            }
        }
        
    if(overTime > 60){
        ctx.fillStyle = "#FF0000";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER",320,160);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("RESULT",320,192);
        ctx.textAlign = "start";

        let singPer = 0;
        let doubPer = 0;
        let tripPer = 0;
        let tetrPer = 0;
        
        if(total == 0){
            singPer = 0;
            doubPer = 0;
            tripPer = 0;
            tetrPer = 0;
        }else{
            singPer = Math.round(((single / total)*100) * 10) / 10;
            doubPer = Math.round(((double / total)*100) * 10) / 10;
            tripPer = Math.round(((triple / total)*100) * 10) / 10;
            tetrPer = Math.round(((tetris / total)*100) * 10) / 10;
        }
        ctx.fillText("SINGLE: "+single+"("+singPer+"%)",224,256);
        ctx.fillText("DOUBLE:"+double+"("+doubPer+"%)",224,288);
        ctx.fillText("TRIPLE: "+triple+"("+tripPer+"%)",224,320);
        ctx.fillText("TETRIS:"+tetris+"("+tetrPer+"%)",224,352);
        ctx.fillText("SCORE:"+score,224,416)
        ctx.textAlign = "center";
        ctx.fillText("ENTER:RESTART",320,540);
        ctx.fillText("ESC:MODE SELECT",320,572)
        ctx.textAlign = "left";

    }else{
        overTime++;
    }

    for(var n = 0; n < nextCnt; n++){
        for(var h = 0; h < minoData[next[n]][0].length; h++){
            for(var w = 0; w < minoData[next[n]][0][h].length; w++){
                switch(minoData[next[n]][0][h][w]){
                    case 0:
                        ctx.fillStyle = "#000000";
                        break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        break;
                }
                ctx.fillRect(480+(24*w),192+(24*h)+(64*n),23,23);
                //minoData[n][0][h][w];
            }
        }
    }
    if(hold != -1){
        for(var h = 0; h < minoData[hold][0].length; h++){
            for(var w = minoData[hold][0][h].length-1; w >= 0; w--){
                switch(minoData[hold][0][h][w]){
                    case 0:
                        ctx.fillStyle = "#000000";
                        break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        break;
                }
                ctx.fillRect(64+(24*w),192+(24*h),23,23);
                //minoData[n][0][h][w];
            }
        }
    }
}

function configDraw(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(175,144,290,505);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "15pt sans-selif";
    if(!waiting){
        ctx.fillRect(208,246+(32*(keyindex)),15,15);
        ctx.fillText("左移動："+getCodeName(LEFTKEY),232,260)
        ctx.fillText("右移動："+getCodeName(RIGHTKEY),232,292)
        ctx.fillText("ソフトドロップ："+getCodeName(SOFTKEY),232,324)
        ctx.fillText("ハードドロップ："+getCodeName(HARDKEY),232,356)
        ctx.fillText("右回転："+getCodeName(RSPINKEY),232,388)
        ctx.fillText("左回転："+getCodeName(LSPINKEY),232,420)
        ctx.fillText("ホールド："+getCodeName(HOLDKEY),232,452)
    }else{
        ctx.textAlign = "center";
        let keyI = [
            "左移動",
            "右移動",
            "ソフトドロップ",
            "ハードドロップ",
            "右回転",
            "左回転",
            "ホールド"
        ]
        ctx.fillText(keyI[keyindex]+"のキーを入力してください",320,356)
        ctx.textAlign = "start";
    }
}

function gclearDraw(){
    clearInterval(timeID)
    TAmili = 0;
    TAsec = 0;
    TAmin = 0;
    if(overTime <= 60){
    ctx.fillStyle = "#005000";
    ctx.fillRect(152+48,48+96,241,481);
    }
    ctx.fillStyle = "#000000";
    for(var h = 0; h < drawF.length; h++){
        for(var w = 0; w < drawF[h].length; w++){
            if(drawF[h][w] == 0){
                ctx.fillRect(152+(24*w),48+(24*h+1),23,23);
            }
        }
    }
    
        for(var h = 0; h < drawF.length; h++){
            for(var w = 0; w < drawF[h].length; w++){
                //0 Air 1 Red 2 Orange 3 Yellow 4 Green 5 Cyan 6 Blue 7 Purple 8 Wall 9 Effect
                if(drawF[h][w] != 0){
                    if(drawF[h][w] == 8){
                        ctx.fillStyle = "#FFFFFF";   
                    }else{
                        ctx.fillStyle = "#00FF00";
                    }
                    if(h > 2){
                        if(drawF[h][w] == 8 || overTime <= 60){
                            ctx.fillRect(152+(24*w),48+(24*h+1),23,23);
                        }
                    }
                }
            }
        }
        
    if(overTime > 60){
        ctx.fillStyle = "#00FF00";
        ctx.textAlign = "center";
        if(gamemode == LINEATTACK)  ctx.fillText("FINISH!",320,160);
        if(gamemode == TIMEATTACK)  ctx.fillText("TIME OVER",320,160);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("RESULT",320,192);
        ctx.textAlign = "start";

        let singPer = 0;
        let doubPer = 0;
        let tripPer = 0;
        let tetrPer = 0;
        
        if(total == 0){
            singPer = 0;
            doubPer = 0;
            tripPer = 0;
            tetrPer = 0;
        }else{
            singPer = Math.round(((single / total)*100) * 10) / 10;
            doubPer = Math.round(((double / total)*100) * 10) / 10;
            tripPer = Math.round(((triple / total)*100) * 10) / 10;
            tetrPer = Math.round(((tetris / total)*100) * 10) / 10;
        }
        ctx.fillText("SINGLE: "+single+"("+singPer+"%)",224,256);
        ctx.fillText("DOUBLE:"+double+"("+doubPer+"%)",224,288);
        ctx.fillText("TRIPLE: "+triple+"("+tripPer+"%)",224,320);
        ctx.fillText("TETRIS:"+tetris+"("+tetrPer+"%)",224,352);
        ctx.fillText("SCORE:"+score,224,416)
        ctx.textAlign = "center";
        ctx.fillText("ENTER:RESTART",320,540);
        ctx.fillText("ESC:MODE SELECT",320,572)
        ctx.textAlign = "left";

    }else{
        overTime++;
    }

    for(var n = 0; n < nextCnt; n++){
        for(var h = 0; h < minoData[next[n]][0].length; h++){
            for(var w = 0; w < minoData[next[n]][0][h].length; w++){
                switch(minoData[next[n]][0][h][w]){
                    case 0:
                        ctx.fillStyle = "#000000";
                        break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        break;
                }
                ctx.fillRect(480+(24*w),192+(24*h)+(64*n),23,23);
                //minoData[n][0][h][w];
            }
        }
    }
    if(hold != -1){
        for(var h = 0; h < minoData[hold][0].length; h++){
            for(var w = minoData[hold][0][h].length-1; w >= 0; w--){
                switch(minoData[hold][0][h][w]){
                    case 0:
                        ctx.fillStyle = "#000000";
                        break;
                    case 1:
                        ctx.fillStyle = "#FF0000";
                        break;
                    case 2:
                        ctx.fillStyle = "#FF8000";
                        break;
                    case 3:
                        ctx.fillStyle = "#FFFF00";
                        break;
                    case 4:
                        ctx.fillStyle = "#00FF00";
                        break;
                    case 5:
                        ctx.fillStyle = "#00FFFF";
                        break;
                    case 6:
                        ctx.fillStyle = "#0000FF";
                        break;
                    case 7:
                        ctx.fillStyle = "#FF00FF";
                        break;
                    case 8:
                        ctx.fillStyle = "#FFFFFF";
                        break;
                    case 9:
                        ctx.fillStyle = "rgb("+efc+","+efc+","+efc+")";
                        break;
                }
                ctx.fillRect(64+(24*w),192+(24*h),23,23);
                //minoData[n][0][h][w];
            }
        }
    }
}

function gameInit(){
    first = true;
    hold = -1;
    next = [0,0,0,0,0,0];
    spawned = [false,false,false,false,false,false,false];

    score = 0;  // スコア
    lines = 0;  // ライン数
    if(gamemode != GRANDMASTER){
        level = startLevel;  // レベル
    }else{
        level = 1;
    }
    grandLV = 0;
    difficulty();

    single = 0; // シングル
    double = 0; // ダブル
    triple = 0; // トリプル
    tetris = 0; // テトリス

    total = 0;
    nowmode = GAMING;

    pind = 0;
    nextEX = 10;

    hour = 0;
    minute = 0;
    second = 0;
    mili = 0;

    allClear = false;
    tspin = false;
    backtoback = false;

    normaLine = (setNorma + 1)* 50;

    TAmin = setMin[minIndex];
    TAsec = 0;
    TAmili = 60;

    field = [
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//24(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//23(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//22(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//21(I)
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//20
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//19
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//18
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//17
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//16
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//15
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//14
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//13
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//12
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//11
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//10
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//9
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//8
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//7
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//6
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//5
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//4
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//3
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//2
        [0,8,0,0,0,0,0,0,0,0,0,0,8,0],//1
        [0,8,8,8,8,8,8,8,8,8,8,8,8,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0]//-1
    ];
    

    for(var i = 0; i < field.length; i++){
        drawF[i] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    for(var h = 0; h < field.length; h++){
        for(var w = 0; w < field[h].length; w++){
            drawF[h][w] = field[h][w];
        }
    }

    overTime = 0;
    if(gamemode != TIMEATTACK){
        timeID = setInterval(stopwatch,16);
    }else{
        timeID = setInterval(timer,16);
    }
    nextCreate();
}

function ghostFunc(){
    let ghostl = false
    gx = x;
    gy = y;
    while(!ghostl){
        for(var h = 0; h < minoData[nowMino][direc].length; h++){
            for(var w = 0; w < minoData[nowMino][direc][h].length; w++){
                if(fallMino[direc][h][w] != 0){
                    if(field[gy+h+1][gx+w] != 0){
                        ghostl = true;
                    }
                }
            }
        }
        if(!ghostl){
            gy++;
        }
    }

    for(var h = 0; h < minoData[nowMino][direc].length; h++){
        for(var w = 0; w < minoData[nowMino][direc][h].length; w++){
            if(minoData[nowMino][direc][h][w] != 0){
                
                switch(minoData[nowMino][direc][h][w]){
                    case 1:
                        ctx.fillStyle = "#800000";
                        break;
                    case 2:
                        ctx.fillStyle = "#804000";
                        break;
                    case 3:
                        ctx.fillStyle = "#808000";
                        break;
                    case 4:
                        ctx.fillStyle = "#008000";
                        break;
                    case 5:
                        ctx.fillStyle = "#008080";
                        break;
                    case 6:
                        ctx.fillStyle = "#000080";
                        break;
                    case 7:
                        ctx.fillStyle = "#800080";
                        break;
                }
                ctx.fillRect(152+(24*(w+gx)),49+(24*(h+gy)),23,23);
            }
        }
    }
}

function resetField(){
    for(var h = 0; h < field.length; h++){
        for(var w = 0; w < field[h].length; w++){
            drawF[h][w] = field[h][w];
        }
    }
}

function difficulty(){  // レベル別落下速度の設定
    if(gamemode == GRANDMASTER){
        while(grandLV >= level * 25){
            level++;
        }
    }
    switch(level){
        case 0:
            normalF = 66;
            normalG = 1;
            softF = 4;
            softG = 1;
            break;
        case 1:
            normalF = 60;
            normalG = 1;
            softF = 3;
            softG = 1;
            break;
        case 2:
            normalF = 50;
            normalG = 1;
            softF = 2;
            softG = 1;
            break;
        case 3:
            normalF = 40;
            normalG = 1;
            softF = 2;
            softG = 1;
            break;
        case 4:
            normalF = 30;
            normalG = 1;
            softF = 2;
            softG = 1;
            break;
        case 5:
            normalF = 20;
            normalG = 1;
            softF = 1;
            softG = 1;
            break;
        case 6:
            normalF = 15;
            normalG = 1;
            softF = 1;
            softG = 1;
            break;
        case 7:
            normalF = 10;
            normalG = 1;
            softF = 1;
            softG = 2;
            break;
        case 8:
            normalF = 5;
            normalG = 1;
            softF = 1;
            softG = 4;
            break;
        case 9:
            normalF = 2;
            normalG = 1;
            softF = 1;
            softG = 10;
            break;
        case 10:
            normalF = 1;
            normalG = 1;
            softF = 1;
            softG = 20;
            break;
        default:
            normalF = 1;
            normalG = 1;
            softF = 1;
            softG = 20;
            break;
    }
    if(level >= 11){
        normalG = (level-10) * 2;
        if(normalG >= 20){
            normalG = 20;
        }
    }
    if(level >= 21){
        idle = 40 - ((level - 20) * 5)
        if(idle <= 15){
            idle = 15;
        }
    }else{
        idle = 45;
    }
}

function createMino(){  // テトリミノの作成
    var minoLength = 3;
    x = 5;
    y = 3;
    direc = 0;
    fallT = 0;
    if(nowMino == 2){
        minoLength = 2;
    }else if(nowMino == 4){
        minoLength = 4;
    }

    for(var r = 0; r < 4; r++){
        fallMino[r] = new Array();
        for(var h = 0; h < minoLength; h++){
            fallMino[r][h] = new Array();
        }
    }
    
    for(var r = 0; r < 4; r++){
        for(var h = 0; h < minoLength; h++){
            for(var w = 0; w < minoLength; w++){
                fallMino[r][h][w] = minoData[nowMino][r][h][w];
            }
        }
    }

    if(HitCheck()){
        nowmode = GAMEOVER;
    }
}

function setMino(){ // 描画用フィールドに落下用ミノをセット
    for(var h = 0; h < fallMino[direc].length; h++){
        for(var w = 0; w < fallMino[direc][h].length; w++){
            if(drawF[y+h][x+w] == 0){
                drawF[y+h][x+w] = fallMino[direc][h][w];
            }
        }
    }
}

function downMino(){    // テトリミノ落下処理
    if(soft){
        fall = softF;
        g = softG;
    }else{
        fall = normalF;
        g = normalG;
    }
    //landing = false;
    if(!hard){
        var land = false;
        for(var h = 0; h < fallMino[direc].length; h++){
            for(var w = 0; w < fallMino[direc][h].length; w++){
                if(fallMino[direc][h][w] != 0){
                    if(drawF[y+h+1][x+w] != 0){
                        land = true;
                    }
                }
            }
        }
        if(!land){
            idleT = 0;
            fallT ++;
            gCount = 0;
            if(fallT >= fall){
                var gland = false;
                while(!gland && gCount < g){
                    for(var h = 0; h < fallMino[direc].length; h++){
                        for(var w = 0; w < fallMino[direc][h].length; w++){
                            if(fallMino[direc][h][w] != 0){
                                if(drawF[y+h+1][x+w] != 0){
                                    gland = true;
                                }
                            }
                        }
                    }
                    if(!gland){
                        y++;
                        tspin = false;
                    }
                    if(soft){
                        score++;
                    }
                    gCount++;
                }
                fallT = 0;
            } 
            landing = false;
        }else{
            landing = true;
            if(resetCnt >= 15){
                idleT = 999;
            }
            idleT++
            if(idleT >= idle){
                lockMino();
                idleT = 0;
            }
        }
    }else{
        var land = false;
        while(!land){
            for(var h = 0; h < fallMino[direc].length; h++){
                for(var w = 0; w < fallMino[direc][h].length; w++){
                    if(fallMino[direc][h][w] != 0){
                        if(field[y+h+1][x+w] != 0){
                            land = true;
                        }
                    }
                }
            }
            if(!land){
                y++;
                score++;
            }
        }
        lockMino();
        idleT = 0;
        hard = false;
    }
}

function moveMino(key){ // テトリミノ移動処理
    var canLeft = true;
    var canRight = true;
    if(key == 37){
        for(var h = 0; h < fallMino[direc].length; h++){
            for(var w = 0; w < fallMino[direc].length; w++){
                if(fallMino[direc][h][w] != 0){
                    if(field[y+h][x+(w-1)] != 0){
                        canLeft = false;
                        break;
                    }
                }
            }
        }
        if(canLeft){
            x--;
            tspin = false;
            if(landing){
                resetCnt++;
                idleT = 0;
            }
        }
    }else if(key == 39){
        for(var h = 0; h < fallMino[direc].length; h++){
            for(var w = 0; w < fallMino[direc].length; w++){
                if(fallMino[direc][h][w] != 0){
                    if(field[y+h][x+(w+1)] != 0){
                        canRight = false;
                        break;
                    }
                }
            }
        }
        if(canRight){
            x++;
            tspin = false;
            if(landing){
                resetCnt++;
                idleT = 0;
            }
        }
    }
}

function spinMino(key){ // テトリミノ回転処理
    if(key == RSPINKEY){
        if(direc == 3){
            prevD = direc;
            direc = 0;
        }else{
            prevD = direc;
            direc ++;
        }
        if(landing){
            resetCnt++;
            idleT = 0;
        }
        SRSRight();
        if(nowMino == 6){
            TSpinCheck();
        }
    }else if(key == LSPINKEY){
        if(direc == 0){
            prevD = direc;
            direc = 3;
        }else{
            prevD = direc;
            direc --;
        }
        if(landing){
            resetCnt++;
            idleT = 0;
        }
        SRSLeft();
        if(nowMino == 6){
            TSpinCheck();
        }
    }
}

function SRSRight(){ // スーパーローテーション
    px = x;
    py = y;
    
    var trySpin = 0;
    var fixx = new Array()
    var fixy = new Array()
    if(nowMino != 4){
        fixx = [
            [0,-1,-1,0,-1,0], // 3->0
            [0,-1,-1,0,-1,0], // 0->1
            [0,1,1,0,1,0],    // 1->2
            [0,1,1,0,1,0]     // 2->3
        ];
        fixy = [
            [0,0,-1,1,2,0],   // 3->0
            [0,0,1,-1,-2,0],  // 0->1
            [0,0,-1,1,2,0],   // 1->2
            [0,0,1,-1,-2,0]   // 2->3
        ];
    }else{
        fixx = [
            [0,1,-2,1,-2,0],  // 3->0
            [0,-2,1,-2,1,0],  // 0->1
            [0,-1,2,-1,2,0],  // 1->2
            [0,2,-1,2,-1,0]   // 2->3
        ];
        fixy = [
            /*
            [0,0,0,-2,1,0],   // 3->0
            [0,0,0,-1,2,0],  // 0->1
            [0,0,0,2,-1,0],   // 1->2
            [0,0,0,1,-2,0]   // 2->3
            */
           
            [0,0,0,1,-2,0],   // 1->0
            [0,0,0,-2,1,0],   // 2->1
            [0,0,0,-1,2,0],   // 3->2
            [0,0,0,2,-1,0]    // 0->3
            
        ];
    }
    while(HitCheck() && trySpin < 6){
        console.log("Test:"+trySpin+",FIXX:"+fixx[direc][trySpin]+",FIXY:"+fixy[direc][trySpin]);
        x = px + fixx[direc][trySpin];
        y = py + fixy[direc][trySpin];
        trySpin++;
        console.log("Dir"+direc+",PrevX:"+px+",X:"+x+",PrevY:"+py+",Y:"+y+",TEST:"+trySpin);
    }
    if(trySpin == 6){
        x = px;
        y = py;
        direc = prevD;
        console.log("Fail");
    }
}

function SRSLeft(){ // スーパーローテーション
    px = x;
    py = y;
    
    var trySpin = 1;
    var fixx = new Array()
    var fixy = new Array()
    if(nowMino != 4){
        fixx = [
            [0,1,1,0,1,0],    // 1->0
            [0,-1,-1,0,-1,0], // 2->1
            [0,-1,-1,0,-1,0], // 3->2
            [0,1,1,0,1,0]     // 0->3
        ];
        fixy = [
            [0,0,-1,1,2,0],   // 1->0
            [0,0,1,-1,-2,0],  // 2->1
            [0,0,-1,1,2,0],   // 3->2
            [0,0,1,-1,-2,0]   // 0->3
        ];
    }else{
        fixx = [
            [0,2,-1,2,-1,0],  // 1->0
            [0,1,-2,1,-2,0],  // 2->1
            [0,-2,1,-2,1,0],  // 3->2
            [0,-1,2,-1,2,0]   // 0->3
        ];
        fixy = [
            /*
            [0,0,0,1,-2,0],   // 1->0
            [0,0,0,-2,1,0],   // 2->1
            [0,0,0,-1,2,0],   // 3->2
            [0,0,0,2,-1,0]    // 0->3
            */
           
            [0,0,0,-2,1,0],   // 3->0
            [0,0,0,-1,2,0],  // 0->1
            [0,0,0,2,-1,0],   // 1->2
            [0,0,0,1,-2,0]   // 2->3
            
        ];
    }
    while(HitCheck() && trySpin < 6){
        //console.log("Test:"+trySpin+",FIXX:"+fixx[direc][trySpin]+",FIXY:"+fixy[direc][trySpin]);
        x = px + fixx[direc][trySpin];
        y = py + fixy[direc][trySpin];
        trySpin++;
        //console.log("Dir"+direc+",PrevX:"+px+",X:"+x+",PrevY:"+py+",Y:"+y+",TEST:"+trySpin);
    }
    if(trySpin == 6){
	x = px;
        y = py;
        direc = prevD;
        console.log("Fail");
    }
}

function HitCheck(){    // 当たり判定
    for(var h = 0; h < fallMino[direc].length; h++){
        for(var w = 0; w < fallMino[direc][h].length; w++){
            if(fallMino[direc][h][w] != 0){
                if(field[y+h][x+w] != 0){
                    //console.log("Col");
                    return true;
                }
            }
        }
    }
    return false;
}

function TSpinCheck(){
    var corner = 0;
    for(var h = 0; h < fallMino[direc].length; h += 2){
        for(var w = 0; w < fallMino[direc][h].length; w += 2){
            if(fallMino[direc][h][w] == 0){
                if(field[y+h][x+w] != 0){
                    corner ++;
                }
            }
        }
    }
    if(corner >= 3){
        tspin = true;
    }
}

function AllClear(lineScore){
    for(var h = 4; h < 24; h++){
        for(var w = 2; w < 12; w++){
            if(field[h][w] != 0 && field[h][w] != 9){
                return;
            }
        }
    }
    allClearEffect = 80;
    allClear = true;
    score += (lineScore * 10 ) - lineScore;
}

function lockMino(){    // ミノの固定
    //console.log("LOCKED!");
    for(var h = 0; h < fallMino[direc].length; h++){
        for(var w = 0; w < fallMino[direc][h].length; w++){
            if(field[y+h][x+w] == 0){
                field[y+h][x+w] = fallMino[direc][h][w];
            }
        }
    }
    if(gamemode == GRANDMASTER){

        if(!( (grandLV - 99 ) % 100 == 0 )){
            grandLV++;
        }
    }
    holded = false;
    checkLine();
    if(tspin)   tspinEffect = 50;
    if(!erasing){
        if(tspin)   score += 100;
        tspin = false;
        nextCreate()
    }
}

function checkLine(){   // ラインチェック
    let erase = 0;
    for(var h = 0; h < field.length-2; h++){
        let detect = 0;
        for(var w = 2; w < 12; w++){
            if(field[h][w] != 0 && field[h][w] != 9){
                detect++;
            }
        }
        if(detect == 10){
            for(var w = 2; w < 12; w++){
                field[h][w] = 9;
            }
            erase++;
        }
    }
    lines += erase;
    let multiPlier;
    if(gamemode == STANDARD || gamemode == GRANDMASTER){
        if(level >= 0 && level < 3){
            multiPlier = 1;
        }else if(level >= 3 && level < 5){
            multiPlier = 2;
        }else if(level >= 5 && level < 7){
            multiPlier = 3;
        }else if(level >= 7 && level < 9){
            multiPlier = 4;
        }else if(level >= 9 && level < 14){
            multiPlier = 5;
        }else if(level >= 14 && level < 20){
            multiPlier = 7;
        }else if(level >= 20){
            multiPlier = 10;
        }
    }else{
        multiPlier = 1;
    }
    let getscore = 0;
    switch(erase){
        case 1:
            if(!tspin){
                getscore = 100 * multiPlier;
                backtoback = false;
            }else{
                if(!backtoback){
                    getscore = 200 * multiPlier;
                }else{
                    eback = true;
                    getscore = 400 * multiPlier;
                }
                backtoback = true;
            }
            single++;
            if(gamemode == GRANDMASTER){
                grandLV ++;
            }
            break;
        case 2:
            if(!tspin){
                getscore = 400 * multiPlier;
                backtoback = false;
            }else{
                if(!backtoback){
                    getscore = 1200 * multiPlier;
                }else{
                    eback = true;
                    getscore = 2400 * multiPlier;
                }
                backtoback = true;
            }
            double++;
            if(gamemode == GRANDMASTER){
                grandLV += 2;
            }
            break;
        case 3:
            if(!tspin){
                getscore = 900 * multiPlier;
                backtoback = false;
            }else{
                if(!backtoback){
                    getscore = 1600 * multiPlier;
                }else{
                    eback = true;
                    getscore = 3200 * multiPlier;
                }
                backtoback = true;
            }
            triple++;
            if(gamemode == GRANDMASTER){
                grandLV += 3;
            }
            break;
        case 4:
            if(!backtoback){
                getscore = 2000 * multiPlier;
            }else{
                eback = true;
                getscore = 4000 * multiPlier;
            }
            backtoback = true;
            tetris++;
            if(gamemode == GRANDMASTER){
                grandLV += 4;
            }
            break;
    }

    score += getscore;
    effectScore = getscore;
    AllClear(getscore);
    
    lineEffect = erase;
    if(erase != 0){
        total++;
        erasing = true;
    }
}

function eraseLine(){   // ライン消去
    for(var h = field.length-3; h >= 0; h--){
        let detect = 0;
        for(var w = 2; w < 12; w++){
            if(field[h][w] == 9){
                field[h][w] = 0;
                field[h][w] = field[h-1][w];
                for(var ih = h-1; ih > 0; ih--){
                    field[ih][w] = field[ih-1][w];
                }
                h++
            }
        }
    }
    //for(var h =)
    resetField();
    erasing = false;
    eback = false;
    if(gamemode == LINEATTACK){
        if(lines >= normaLine){
            nowmode = CLEAROVER;
        }
    }
    allClear = false;
    tspin = false;
    nextCreate();
}

function nextCreate(){
    if(gamemode == STANDARD){
        while(lines >= /*10 * level*/nextEX){
            level++;
		    nextEX += 10;
        }
    }

    difficulty();

    idleT = 0;
    resetCnt = 0;
    if(!first){
        nowMino = next[0]
        for(var ii = 1; ii < 7; ii++){
            next[ii-1] = next[ii];
        }
        if(nextMode == 0){
            next[6] = Math.floor(Math.random() * 7);
        }else{
            let nnex = Math.floor(Math.random() * 7);
            while(spawned[nnex]){
                nnex = Math.floor(Math.random() * 7);
            }
            next[6] = nnex;
            spawned[nnex] = true;
        }
    }else{
        if(nextMode == 0){
            for(var ii = 0; ii < 7; ii++){
                next[ii] = Math.floor(Math.random() * 7);
            }
        }else{
            for(var i = 0; i < 7; i++){
                let nnex = Math.floor(Math.random() * 7);
                while(spawned[nnex]){
                    nnex = Math.floor(Math.random() * 7);
                }
                next[i] = nnex;
                spawned[nnex] = true;
            }
        }
        first = false;
        nowMino = Math.floor(Math.random() * 7);
    }
    createMino(nowMino);
}

function holdMino(){
    if(!holded){
        if(hold == -1){
            hold = nowMino;
            nextCreate();
        }else{
            var oldhold = nowMino;
            nowMino = hold;
            createMino(nowMino);
            hold = oldhold;
        }
        holded = true;
    }
}

function stopwatch(){
    if(nowmode != PAUSE){
        mili++;
        if(mili >= 60){
            if(second < 59){
                second++;
            }else{
                if(minute < 59){
                    minute++;
                }else{
                    if(hour < 59){
                        hour ++;
                    }
                }
                second = 0;
            }
            mili = 0;
        }
    }
}

function timer(){
    if(nowmode != PAUSE){
        TAmili--;
        if(TAmili <= 0){
            if(TAsec != 0){
                TAsec--;
            }else{
                if(TAmin != 0){
                    TAmin--;
                }else{
                    nowmode = CLEAROVER;
                }
                TAsec = 59;
            }
            TAmili = 60;
        }
    }
}

function setGameRule(key){
    if(gamemode == STANDARD){
        switch(index){
            case 0: // レベル
                levelSet(key);
                break;
            case 1: // ネクストの数
                nextCntSet(key);
                break;
            case 2:
                ghost = !ghost;
                break;
            case 3:
                nextModeSet();
                break;
            case 4:
                canhold = !canhold;
                break;
        }
    }else if(gamemode == LINEATTACK){
        switch(index){
            case 0: // レベル
                levelSet(key);
                break;
            case 1:
                normaSet(key);
                break;
            case 2: // ネクストの数
                nextCntSet(key);
                break;
            case 3:
                ghost = !ghost;
                break;
            case 4:
                nextModeSet();
                break;
            case 5:
                canhold = !canhold;
                break;
        }
    }else if(gamemode == TIMEATTACK){
        switch(index){
            case 0: // レベル
                levelSet(key);
                break;
            case 1:
                timeSet(key);
                break;
            case 2: // ネクストの数
                nextCntSet(key);
                break;
            case 3:
                ghost = !ghost;
                break;
            case 4:
                nextModeSet();
                break;
            case 5:
                canhold = !canhold;
                break;
        }
    }else if(gamemode == GRANDMASTER){
        switch(index){
            case 0: // ネクストの数
                nextCntSet(key);
                break;
            case 1:
                ghost = !ghost;
                break;
            case 2:
                nextModeSet();
                break;
            case 3:
                canhold = !canhold;
                break;
        }
    }

}

function levelSet(key){
    if(key == 37){
        if(startLevel == 0){
            startLevel = 9;
        }else{
            startLevel--;
        }
    }else if(key == 39){
        if(startLevel == 9){
            startLevel = 0;
        }else{
            startLevel++;
        }
    }
}

function normaSet(key){
    if(key == 37){
        if(setNorma == 0){
            setNorma = 2;
        }else{
            setNorma--;
        }
    }else if(key == 39){
        if(setNorma == 2){
            setNorma = 0;
        }else{
            setNorma++;
        }
    }
}

function timeSet(key){
    if(key == 37){
        if(minIndex == 0){
            minIndex = 2;
        }else{
            minIndex--;
        }
    }else if(key == 39){
        if(minIndex == 2){
            minIndex = 0;
        }else{
            minIndex++;
        }
    }
}

function nextCntSet(key){
    if(key == 37){
        if(nextCnt == 0){
            nextCnt = 6;
        }else{
            nextCnt--;
        }
    }else if(key == 39){
        if(nextCnt == 6){
            nextCnt = 0;
        }else{
            nextCnt++;
        }
    }
}

function nextModeSet(){
    if(nextMode == 0){
        nextMode = 1;
    }else{
        nextMode = 0;
    }
}




window.addEventListener("keyup", keyup);
function keyup(event){
    if(event.keyCode == 27){
        pauseK = 0;
    }
    if(event.keyCode == HARDKEY){
        hardK = 0;
        hard = false;
    }
    if(event.keyCode == RSPINKEY || event.keyCode == LSPINKEY){
        spined = false;
    }
    if(event.keyCode == SOFTKEY){
        soft = false;
    }
}

window.addEventListener("keydown", keydown);
function keydown(event){
    if(nowmode == MODESELECT){
        if(event.keyCode == 38){
            if(gamemode == STANDARD){
                gamemode = GRANDMASTER;
            }else{
                gamemode--;
            }
        }else if(event.keyCode == 40){
            if(gamemode == GRANDMASTER){
                gamemode = STANDARD;
            }else{
                gamemode++;
            }
        }
        if(event.keyCode == 13){
            if(gamemode != KCONFIG){
                index = 0;
                nowmode = SETTING;
            }else{
                keyindex = 0;
                nowmode = KEYCONFIG;
            }
        }
    }else if(nowmode == SETTING){
        let maxmode;
        if(gamemode == STANDARD){
            maxmode = 4;
        }else if(gamemode == LINEATTACK || gamemode == TIMEATTACK){
            maxmode = 5;
        }else if(gamemode == GRANDMASTER){
            maxmode = 3;
        }
        
        if(event.keyCode == 27){
            nowmode = MODESELECT;
        }

        if(event.keyCode == 38){    
            if(index == 0){
                index = maxmode;
            }else{
                index--;
            }
        }else if(event.keyCode == 40){
            if(index == maxmode){
                index = 0;
            }else{
                index++;
            }
        }

        if(event.keyCode == 37 || event.keyCode == 39){
            setGameRule(event.keyCode);
        }
        if(event.keyCode == 13){
            gameInit();
        }
    }else if(nowmode == GAMING){
        if(event.keyCode == 27){
            pauseK++;
            if(pauseK == 1){
                nowmode = PAUSE;
            }
        }
        if(!erasing){
            if(event.keyCode == HARDKEY){
                hardK ++;
                if(hardK == 1){
                    hard = true;
                }
            }
            if(event.keyCode == LEFTKEY || event.keyCode == RIGHTKEY){
                moveMino(event.keyCode);
            }
            if(event.keyCode == RSPINKEY || event.keyCode == LSPINKEY){
                if(!spined){
                    spinMino(event.keyCode);
                    spined = true;
                }
            }
            if(event.keyCode == SOFTKEY){
                if(!soft && landing){
                    idleT = 99999;
                }
                soft = true;
            }
            if(canhold && event.keyCode == HOLDKEY){
                if(!holded){
                    holdMino();
                }
            }
        }
    }else if(nowmode == PAUSE){
        if(event.keyCode == 27){
            pauseK++;
            if(pauseK == 1){
                nowmode = GAMING;
            }
        }
        if(event.keyCode == 38 || event.keyCode == 40){
            if(pind == 0) pind = 1;
            else if(pind == 1) pind = 0;
        }
        if(event.keyCode == 13){
            if(pind == 0)   nowmode = GAMING;
            if(pind == 1){
               nowmode = MODESELECT;
               clearInterval(timeID);
            }
        }
    }else if(nowmode == GAMEOVER || nowmode == CLEAROVER){
        if(event.keyCode == 13){
            gameInit();
        }
        if(event.keyCode == 27){
            nowmode = MODESELECT;
        }
    }else if(nowmode == KEYCONFIG){
        if(!waiting){
            if(event.keyCode == 27){
                nowmode = MODESELECT;
            }
            if(event.keyCode == 38){
                if(keyindex == 0){
                    keyindex = 6;
                }else{
                    keyindex--;
                }
            }else if(event.keyCode == 40){
                if(keyindex == 6){
                    keyindex = 0;
                }else{
                    keyindex++;
                }
            }
            if(event.keyCode == 13){
                waiting = true;
            }
        }else{
            if(event.keyCode != 13){
                switch(keyindex){
                    case 0:
                        LEFTKEY = event.keyCode;
                        setCookie("LEFT",event.keyCode);
                        break;
                    case 1:
                        RIGHTKEY = event.keyCode;
                        setCookie("RIGHT",event.keyCode);
                        break;
                    case 2:
                        SOFTKEY = event.keyCode;
                        setCookie("SOFT",event.keyCode);
                        break;
                    case 3:
                        HARDKEY = event.keyCode;
                        setCookie("HARD",event.keyCode);
                        break;
                    case 4:
                        RSPINKEY = event.keyCode;
                        setCookie("RSPIN",event.keyCode);
                        break;
                    case 5:
                        LSPINKEY = event.keyCode;
                        setCookie("LSPIN",event.keyCode);
                        break;
                    case 6:
                        HOLDKEY = event.keyCode;
                        setCookie("HOLD",event.keyCode);
                        break;
                }
            }
            waiting = false;
        }
        
    }
}

//クッキー
function getCookie(key){
    ck = document.cookie + ";";
    index1 = ck.indexOf(key,0);
    if(index1 != -1){
        ck = ck.substring(index1, ck.length);
        index2 = ck.indexOf("=",0)+1;
        index3 = ck.indexOf(";",index2);
        return(ck.substring(index2,index3));
    }
    return("");
}

function setCookie(key,val){
    ck = key + "=" + val + ";";
    ck += "expires = Mon,31-Dec-2038 23:59:59";
    document.cookie = ck;
}
