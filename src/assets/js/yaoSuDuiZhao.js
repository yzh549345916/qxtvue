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