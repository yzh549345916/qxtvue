function getTomorrowtimeFormat  (hour){
    var mydate = new Date();
    mydate.setDate(mydate.getDate()+1);
    mydate.setHours(hour);
    mydate.setMinutes(0);
    mydate.setSeconds(0);
    mydate.setMilliseconds(0);
    return mydate;
}
export{
    getTomorrowtimeFormat
}
