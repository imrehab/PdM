//===========for testing puposes, to be removed===========
var sensorID="MPU0001";
var assetModel = "IPOWERFAN";
var assetID = "IPOWERFAN001MPU";
var behaviourData = 97;

//===============global variable===========
var streaming = true;
var iterations = 20;//real time visualization number of values displayed
var firstValDate = "";//date of the first sensor reading, used for data streaming filteration

//==============firebase configuration====================
var firebaseConfig= {
    apiKey: "AIzaSyAal-QcuayT4d32G-6YJLw8m7Um5b1BPrg",
    authDomain: "raspberrypi-6b521.firebaseapp.com",
    databaseURL: "https://raspberrypi-6b521.firebaseio.com",
    projectId: "raspberrypi-6b521",
    storageBucket: "raspberrypi-6b521.appspot.com",
    messagingSenderId: "829617435562",
    appId: "1:829617435562:web:3f6548f88b700d529a71d3",
    measurementId: "G-XK5P7KWL53"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var firestore = firebase.firestore();
var database = firebase.database();


var realTimeRef = database.ref('sensor/'+sensorID);
realTimeRef.limitToFirst(1).on('value', setFirstDate, errData);
realTimeRef.off("value");
realTimeRef.limitToLast(iterations).on('value', gotData, errData);

function read() {
    const promise = firestore.collection("Models").doc(assetModel).get();
    const p1 = promise.then( snapshot => {
      const model = snapshot.data();
      assetInfo(extractData(model));
      const promise2 = firestore.collection("Models").doc(assetModel).collection("Assets").doc(assetID).get();
      const p2 = promise2.then( snapshot2 => {
          const asset = snapshot2.data();
          incidents(extractData(asset));
        });
    p2.catch(error =>{
      console.log("Error"+error);
    })
  });
  p1.catch(error =>{
    console.log("Error"+error);
  });
  assetBehaviour(behaviourData);//from model
  //assignFirstDate();
}


function gotData(data){
  if(streaming){
    tempData(data,iterations);
    motionData(data,iterations);
    iterations = 1;
  }
  else{
    deleteData(data);
  }
}


 function setFirstDate(data){
   console.log("inside first date");
   var reads = data.val();
   var keys = Object.keys(reads);
   var date = reads[keys[0]].time.substring(0, 10);
    firstValDate = date;
    console.log(firstValDate);
}

function deleteData(data){
  //delete data when data streaming is paused
}


function updateDate(){
  //refetch the data from firestore for each function
  //=============================
  //update asset health Score
  assetBehaviour(data)
  //update remainin useful life
  assetInfo(data)
  //update icidents(table+chart)
  incidents(data);
  //Notifications?
  //================
}


function extractData(data){
  var list = [];
  var keys = Object.keys(data);
  if(Array.isArray(keys)){
    for(var j=0;j<keys.length;j++){
      var k = data[keys[j]];
      if(Array.isArray(k)){
        for (var i=0;i<k.length;i++){
          list[list.length] = k[i];
        }
      }
      else{
        list[list.length] = k;
      }
    }
  }
  return list;
}


function assetInfo(data){
   //document.getElementById('RUL').innerHTML = data[0];
   document.getElementById('info-id').innerHTML = assetID;
   document.getElementById('info-type').innerHTML = data[7];
   document.getElementById('info-make').innerHTML = data[1];
   document.getElementById('info-model').innerHTML = assetModel;
}

function assetBehaviour(data){
  //BEHAVIOUR VALUE CLASSIFICATIONS IS SUBJECT TO CHANGE
  var text = "<span style=\'font-size: 32px; color: ";
  var text2= "%</span><br><span style=\'font-size: 28px; color: ";
  if(data<70){
    text+="#FF5353\'>"+data+text2+"#FF5353\'>DANGER</span>";
  }
  else if(data<85){
    text+="#FFD221\'>"+data+text2+"#FFD221\'>UNSTABLE</span>";
  }
  else if(data<95){
    text+="#77E6B4\'>"+data+text2+"#77E6B4\'>STABLE</span>";
  }
    else if(data<=100){
      text+="#21D683\'>"+data+text2+"#21D683\'>HEALTHY</span>";
    }

    gaugeChart.series(0).options({ points: [{ x:1, y: data }] });
    gaugeChart.series(0).options({ shape_label_text: text  });

}


function incidents(data){
  //data = all asset info
  var total = [];
  var issues= [];
  var status = "";
  var severity = "";
  var keys = [];
  issues = data[0];
  //check whether issues is a single object or a list
  //loop through issues if is a list
    for(var key in issues){
      keys.push(key);
    }
      switch(issues[keys[1]].toUpperCase()){//severities
        case "HIGH": severity = '<td class="uk-width-2-10 uk-text-nowrap"><small style="color: RGBA(233,89,16,0.75)">HIGHT</small></span></td>';
        total[total.length]= "HIGH";
        break;
        case "MEDIUM": severity = '<td class="uk-width-2-10 uk-text-nowrap"><small style="color: RGBA(253,183,5,0.75)"><small>MEDIUM</small></span></td>';
        total[total.length]= "MEDIUM";
        break;
        case "LOW": severity = '<td class="uk-width-2-10 uk-text-nowrap"><small style="color: RGBA(250,234,12,1)"><small>LOW</small></span></td>';
        total[total.length]= "LOW";
      }
      switch(issues[keys[2]].toUpperCase()){//statuses
        case "HANDLED": status = '<td class="uk-width-2-10 uk-text-right"><a style="width :80px;" class="btn btn-primary btn-sm disabled" tabindex="-1" aria-disabled="true"><small>HANDLED</small></a></td>';
        break;
        case "UNHANDLED": status = '<td class="uk-width-2-10 uk-text-right"><button style="width :80px; " type="button" class="btn btn-primary btn-sm shadow-sm"><small>HANDLE</small></button></td>';
        break;
        case "RESOLVED": status = '<td class="uk-width-2-10 uk-text-right"><a style="width :80px;" class="btn btn-secondary btn-sm disabled" tabindex="-1" aria-disabled="true"><small>RESOLVED</small></a></td>';

      }
      var utcSeconds = issues[keys[3]].seconds;
      var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
      date.setUTCSeconds(utcSeconds);
      document.getElementById('incident-table-body').innerHTML =
      '<tr class="uk-table-middle"><td class="uk-width-2-10 uk-text-nowrap"><small>'+date.toDateString().substring(4, 15)+' - '+date.toString().substring(16, 21)+'</small></td>'
      +severity
      +'<td class="uk-width-4-10 text-wrap"><small>ADD ISSUE DESCRIPTION</small></td>'
      +status
      +'</tr>';

      incidentsGraph(total);
}

function incidentsGraph(incidents){
  var high = 0;
  var medium = 0;
  var low = 0;
  for(var i=0;i<incidents.length;i++){
    switch(incidents[i]){
      case "HIGH": high++;
      break;
      case "MEDIUM": medium++;
      break;
      case "LOW": low++;
    }
  }
  var total = [low,medium,high];
  for(var i=0;i<3;i++){
  doughnutChart.data.datasets.forEach((dataset) => {
          dataset.data.push(total[i]);
        });
      }
    doughnutChart.update();
  }


function tempData(data,iter){
  var temp = [];
  var time = [];
  var reads = data.val();
  var keys = Object.keys(reads);
  for (var i=0; i<iter; i++){
     var k = keys[i];
     temp[temp.length] = Math.round( reads[k].temp * 10) / 10;
     time[time.length] = reads[k].time;
  }
  addTempData(time, temp);
}

function motionData(data,iter){
  var motion;
  var x = [];
  var y = [];
  var z = [];
  var time = [];
  var reads = data.val();
  var keys = Object.keys(reads);
  for (var i=0; i<iter; i++){
     var k = keys[i];
     motion = reads[k].acc;
     x[x.length] = motion[0];
     y[y.length] = motion[1];
     z[z.length] = motion[2];
     time[time.length] = reads[k].time;
  }
  addMotionData(time, x, y, z);
}


function addTempData(label,data) {
for(var i=0; i<label.length;i++){
  tempretureLineChart.data.labels.push(label[i].substring(11, 19));
  tempretureLineChart.data.datasets.forEach((dataset) => {
          dataset.data.push(data[i]);
        });
      }
    tempretureLineChart.update();
}


function addMotionData(label, x, y, z){
  for(var i=0; i<label.length;i++){
    motionLineChart.data.labels.push(label[i].substring(11, 19));
  }
    for(var j=0;j<x.length;j++){
      motionLineChart.data.datasets[0].data.push(x[j]);
      motionLineChart.data.datasets[1].data.push(y[j]);
      motionLineChart.data.datasets[2].data.push(z[j]);
    }
      motionLineChart.update();
  }

function errData(error){
 console.log("Error: "+ error);
}

function toggleStreaming(){
  streaming = !streaming;
}
