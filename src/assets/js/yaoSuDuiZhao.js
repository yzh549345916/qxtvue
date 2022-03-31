//EC要素数字ID转换为文字
function ecIntToStr(dataIDe) {
    switch (dataIDe) {
        case 167:
            return "2米气温";
        case 228:
            return "总降水量";
        case 4:
            return "10米风";
        case 3020:
            return "能见度";
        case 168:
            return "露点温度";
        case 235:
            return "地表温度";
        case 151:
            return "海平面气压";
        case 4100:
            return "100米风";
        case 228028:
            return "过去3小时10米阵风";
        case 123:
            return "过去6小时10米阵风";
        case 228027:
            return "过去3小时2米最低温度";
        case 121:
            return "过去6小时2米最低温度";
        case 122:
            return "过去6小时2米最高温度";
        case 34:
            return "海表温度";
        case 142:
            return "大尺度降水";
        case 143:
            return "对流性降水";
        case 260015:
            return "降水类型";
        case 144:
            return "降雪量";
        case 141:
            return "雪深";
        case 33:
            return "雪密度";
        case 164:
            return "总云量";
        case 186:
            return "低云量";

        default:
            return "其他";

    }
}

export {
    ecIntToStr
}

//EC要素文字转换为数字ID
function ecStrToInt(dataType) {
    switch (dataType) {
        case "2米气温":
            return 167;
        case "总降水量":
            return 228;
        case "10米风":
            return 4;
        case "能见度":
            return 3020;

        case "露点温度":
            return 168;

        case "地表温度":
            return 235;

        case "海平面气压":
            return 151;

        case "100米风":
            return 4100;

        case "过去3小时10米阵风":
            return 228028;

        case "过去6小时10米阵风":
            return 123;

        case "过去3小时2米最低温度":
            return 228027;

        case "过去6小时2米最低温度":
            return 121;

        case "过去6小时2米最高温度":
            return 122;

        case "海表温度":
            return 34;

        case "大尺度降水":
            return 142;

        case "对流性降水":
            return 143;

        case "降水类型":
            return 260015;

        case "降雪量":
            return 144;

        case "雪深":
            return 141;

        case "雪密度":
            return 33;

        case "总云量":
            return 164;

        case "低云量":
            return 186;


        default:
            return -1;

    }
}

export {
    ecStrToInt
}

//亚洲沙尘模式类型格式化
function cuaceDataTypeConvert(dataType) {
    switch (dataType) {
        case "550nm沙尘光学厚度AOD550_DUST":
            return "AOD550_DUST";
        case "3小时累积干沉积DDEPO_DUST":
            return "DDEPO_DUST";
        case "3小时累计湿沉降WDEPO_DUST":
            return "WDEPO_DUST";
        case "地面沙尘通量DFLUX_DUST":
            return "DFLUX_DUST";

        case "含尘量LOAD_DUST":
            return "LOAD_DUST";

        case "地面沙尘浓度SCONC_DUST":
            return "SCONC_DUST";

        case "高空沙尘浓度CONC_DUST":
            return "CONC_DUST";
        default:
            return "";

    }
}

export {
    cuaceDataTypeConvert
}


//区台沙尘模式类型格式化
function qtShaChenDataTypeConvert(dataType) {
    switch (dataType) {
        case "干沉降DUSTDRY":
            return "DUSTDRY";
        case "起沙EDUST":
            return "EDUST";
        case "边界层高度PBLH":
            return "PBLH";
        case "地面沙尘浓度SURFACEDUST":
            return "SURFACEDUST";
        case "PM2.5":
            return "PM25";
        case "PM10":
            return "PM10";
        default:
            return "";

    }
}

export {
    qtShaChenDataTypeConvert
}

//亚洲沙尘模式类型中文
function cuaceDataTypeChineseConvert(dataType) {
    switch (dataType) {
        case "AOD550_DUST":
            return "550nm沙尘光学厚度AOD550_DUST";
        case "DDEPO_DUST":
            return "3小时累积干沉积DDEPO_DUST";
        case "WDEPO_DUST":
            return "3小时累计湿沉降WDEPO_DUST";
        case "DFLUX_DUST":
            return "地面沙尘通量DFLUX_DUST";

        case "LOAD_DUST":
            return "含尘量LOAD_DUST";

        case "SCONC_DUST":
            return "地面沙尘浓度SCONC_DUST";

        case "CONC_DUST":
            return "高空沙尘浓度CONC_DUST";
        default:
            return "";

    }
}

export {
    cuaceDataTypeChineseConvert
}

//区台沙尘模式类型中文
function qtShaChenDataTypeChineseConvert(dataType) {
    switch (dataType) {
        case "DUSTDRY":
            return "干沉降DUSTDRY";
        case "EDUST":
            return "起沙EDUST";
        case "PBLH":
            return "边界层高度PBLH";
        case "SURFACEDUST":
            return "地面沙尘浓度SURFACEDUST";
        case "PM2.5":
            return "PM25";
        case "PM10":
            return "PM10";
        default:
            return "";

    }
}

export {
    qtShaChenDataTypeChineseConvert
}

//京津冀模式类型格式化
function JingjinjiDataTypeConvert(dataType) {
    switch (dataType) {
        case "AQI":
            return "aqi";
        case "PM2.5":
            return "pm25";
        case "PM10":
            return "pm10";
        case "边界层高度PBLH":
            return "pblh";
        case "臭氧O3":
            return "o3";
        case "一氧化碳CO":
            return "co";
        case "二氧化氮NO2":
            return "no2";
        case "二氧化硫SO2":
            return "so2";
        case "能见度":
            return "vis1";
        default:
            return "";

    }
}

export {
    JingjinjiDataTypeConvert
}

function JingjinjiDataTypeChineseConvert(dataType) {
    switch (dataType){
        case  "o3" :
            return "臭氧";
        case  "pm25" :
            return "PM2.5";
        case  "pm10" :
            return "PM10";
        case  "aqi" :
            return "AQI";
        case  "co" :
            return "一氧化碳";
        case  "pblh" :
            return "边界层高度";
        case  "no2" :
            return "二氧化氮";
        case  "so2" :
            return "二氧化硫";
        case  "vis1" :
            return "能见度";
        default:
            return "";
    }
}

export {
    JingjinjiDataTypeChineseConvert
}