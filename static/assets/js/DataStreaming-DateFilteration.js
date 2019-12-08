//FILTER DATA

//GLOBAL VARIABLES
var currentTempDate;
var currentMotionDate
var lastReadingDate;
//INITAL ASSIGNING


function setFirstDate(data){
  var reads = data.val();
  if(reads!=null){
    var keys = Object.keys(reads);
    var date = reads[keys[0]].time.substring(0, 10);
    $(".date-input").attr("min", date);
    $(".date-input").attr("value", getTodayDate());
    currentTempDate = getTodayDate();
    currentMotionDate = getTodayDate();
  }
}


function setLastDate(data){
    var reads = data.val();
    if(reads!=null){
      var keys = Object.keys(reads);
      lastReadingDate = reads[keys[0]].time.substring(0, 10);
      $(".date-input").attr("max", lastReadingDate);
    }
}

//
// $(".date-input").blur(function toggleDateInput(){
//     if(this.value==""){
//       if(this.id=='tempFilter'){
//         document.getElementById("tempFilter").value = getTodayDate();
//           currentTempDate = getTodayDate();
//         }
//         else{
//             document.getElementById("motionFilter").value = getTodayDate();
//           currentMotionDate = getTodayDate();
//         }
//       }
// });
//toggle chart streaming
 $(".streaming-toggler").change(function(){
   var stream = this.checked;
   if(this.id=="temp-streamer"){
     toggleStreaming("temp");
   }
   else{
      toggleStreaming("motion");
   }
});

function toggleStreaming(type){
  if(type=="temp"){
    if(streamingTemp==true){
      pauseTempStream();
    }
    else{
      resumeTempStream();
    }
  }
  else{//type==motion
    if(streamingMotion==true){
      pauseMotionStream();
    }
    else{
        resumeMotionStream();
    }
  }
}

function pauseTempStream(){
  document.getElementById("temp-streamer").checked = false;
  streamingTemp=false;
}

function resumeTempStream(){
  document.getElementById("tempFilter").value = getTodayDate();
  document.getElementById("temp-streamer").checked = true;
  singleChartInitStream("tempFilter");
  streamingTemp = true;
}

function pauseMotionStream(){
  document.getElementById("motion-streamer").checked = false;
  streamingMotion=false;
}

function resumeMotionStream(){
  document.getElementById("motionFilter").value = getTodayDate();
  document.getElementById("motion-streamer").checked = true;
  singleChartInitStream("motionFilter");
  streamingMotion = true;
}


//FILTER FUNCTIONALITIES
$(".date-input").change(function(){
  var date = this.value;
    if(this.id=='tempFilter'){
      dateSwitcher("temp", date);
    }
    if(this.id=='motionFilter'){
      dateSwitcher("motion", date);
    }
  });


function dateSwitcher(type,date){
  if(type=="temp"){
    if(date==currentTempDate){
      return;
    }
    if(date==getTodayDate()){
      resumeTempStream();
    }
    if(date==""){
      document.getElementById("tempFilter").value = getTodayDate();
      resumeTempStream();
    }
    else{
      pauseTempStream();
      filterChartData(date,"tempFilter");
    }
  }
  else{
    if(date==currentTempDate){
      return;
    }
    if(date==getTodayDate()){
      resumeMotionStream();
    }
    if(date==""){
      document.getElementById("motionFilter").value = getTodayDate();
      resumeMotionStream();
    }
    else{
      pauseMotionStream();
      filterChartData(date,"motionFilter");
    }
  }
}

function filterChartData(startDate,type){

  //if specifide date is more than
  var result = [];
  var endDate = getNextDay(startDate);
  var tempRef = database.ref('sensor/'+sensorID).orderByChild('time').startAt(startDate).endAt(endDate).on("value", function(data){
      result = getSubData(data);
      if(type=='tempFilter'){
        currentTempDate = startDate;
        pauseTempStream();
        subTempData(result);
      }
      else if(type=='motionFilter'){
        currentMotionDate = startDate;
        pauseMotionStream();
        subMotionData(result);
      }
  }, errData);
}
//called when chosen date = lastReadingDate = today
function singleChartInitStream(type){
  var empty = [];
  if(type=='tempFilter'){
    //empty chart to append new data
    resetTempChart(empty,empty);
    var singleTRef = database.ref('sensor/'+sensorID).orderByChild('time').startAt(getTodayDate()).limitToLast(numDataPoints).on('value', function(data){
      //fetch data from snapshot and append it to chart
     tempData(data,numDataPoints);
    }, errData);
    //keep at bottom
    //resume chart streaming
    streamingTemp = true;
    currentTempDate = getTodayDate();
  }
  else if(type=='motionFilter'){
    //empty chart to append new data
    resetMotionChart(empty,empty,empty,empty);
    var singleMRef = database.ref('sensor/'+sensorID).orderByChild('time').startAt(getTodayDate()).limitToLast(numDataPoints).on('value', function(data){
      //fetch data from snapshot and append it to chart
      motionData(data,numDataPoints);
    }, errData);
    streamingMotion = true;
    currentMotionDate = getTodayDate();

  }
}

function subTempData(data){
  var temp = [];
  var time = [];
  for (var i=0; i<data.length; i++){
     temp[i] = Math.round( data[i].temp * 10) / 10;
     time[i] = data[i].time.substring(11, 19);
  }
  resetTempChart(time,temp);
}

function subMotionData(data){
  var motion;
  var x = [];
  var y = [];
  var z = [];
  var time = [];
  for (var i=0; i<data.length; i++){
    motion = data[i].acc;
    x[i] = motion[0];
    y[i] = motion[1];
    z[i] = motion[2];
    time[i] = data[i].time.substring(11, 19);
  }
  resetMotionChart(time, x, y, z);
}

function resetTempChart(labels,temp){
  tempretureLineChart.data.datasets[0].data = temp;
  tempretureLineChart.data.labels = labels;

  tempretureLineChart.update();
}

function resetMotionChart(labels,x,y,z){
  motionLineChart.data.datasets[0].data = x;
  motionLineChart.data.datasets[1].data = y;
  motionLineChart.data.datasets[2].data = z;
  motionLineChart.data.labels = labels;

  motionLineChart.update();
}

function getSubData(data) {
    var result = [];
    var reads = data.val();
    if(reads==null){
      return result;
    }
    var keys = Object.keys(reads);
    if(keys.length<=numDataPoints){
      for (var i=0; i<keys.length; i++){
         var k = keys[i];
         result[i]= reads[k];
      }
    }
    else{
      var indexes = listStepLength(keys.length);
      for (var i=0; i<numDataPoints ; i++){
        var k = keys[indexes[i]];
        result[i]= reads[k];
      }
    }
    return result;
}

function listStepLength(length){
  var indexes = [];
  var step = Math.round(length/numDataPoints);
  var index=0;
  for(var i=0;i<numDataPoints;i++){
    indexes[i]=index;
    index+= step;
  }
  return indexes;
}

function getNextDay(date){
  var next = date.substring(0,8);
  var day = parseInt(date.substring(8,10))+1;
  if(day<10){
         day='0'+day
     }
  next+=day.toString();
  return next;
}

function getTodayDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0
  var yyyy = today.getFullYear();
 if(dd<10){//single digit months/dayes formation by appending 0 infront
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }

today = yyyy+'-'+mm+'-'+dd;
return today;
}
