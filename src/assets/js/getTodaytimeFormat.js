function getTodaytimeFormat (hour){
    var mydate = new Date();
    mydate.setHours(hour);
    mydate.setMinutes(0);
    mydate.setSeconds(0);
    mydate.setMilliseconds(0);
    return mydate;
}
export{
    getTodaytimeFormat
}
function getTodayMaxTime (){
    var mydate = new Date();
    mydate.setHours(23);
    mydate.setMinutes(59);
    mydate.setSeconds(59);
    mydate.setMilliseconds(999);
    return mydate;
}
export{
    getTodayMaxTime
}
function getTodayHourAndMinute (){
    var mydate = new Date();
    if(mydate.getHours()<=13){
        return  "08:00";
    }else{
        return  "20:00";
    }
}
export{
    getTodayHourAndMinute
}
function getZNWGTodayHourAndMinute (){
    var mydate = new Date();
    if(mydate.getHours()<= 16){
        return  "08:00";
    }else{
        return  "20:00";
    }
}
export{
    getZNWGTodayHourAndMinute
}
function getTodayHourAndMinuteAndSecond (){
    var mydate = new Date();
    if(mydate.getHours()<=13){
        return  "08:00:00";
    }else{
        return  "20:00:00";
    }
}
export{
    getTodayHourAndMinuteAndSecond
}
function getTodayHourAndMinuteTsp (){
    var mydate = new Date().toISOString().substr(0, 10);
    var mydate1 = new Date()
    if(mydate1.getHours()<= 13){
        return   (new Date((mydate+" "+"08:00:00").substring(0,19).replace(/-/g,'/'))).getTime();
    }else{
        return   (new Date((mydate+" "+"20:00:00").substring(0,19).replace(/-/g,'/'))).getTime();
    }
}
export{
    getTodayHourAndMinuteTsp
}
function getZNWGQbTsp (){
    var mydate = new Date().toISOString().substr(0, 10);
    var mydate1 = new Date()
    if(mydate1.getHours()<= 16){
        return   (new Date((mydate+" "+"08:00:00").substring(0,19).replace(/-/g,'/'))).getTime();
    }else{
        return   (new Date((mydate+" "+"20:00:00").substring(0,19).replace(/-/g,'/'))).getTime();
    }
}
export{
    getZNWGQbTsp
}