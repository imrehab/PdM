//===========for testing puposes, to be removed===========
var assetModel = "IPOWERFAN";

//===============global variable===========
  let assetID = window.getAssetID();
  let sensorID="";
  let streamingTemp = true;
  let streamingMotion = true;
  let numDataPoints = 40;
  let dataSteps = 1;
  let incTableMax = 3;
  var counter=0;
  var currentUser = "";
  var currentUserDoc;
  var currentUserData;
  var issues = [];


  function setCurrentUser(userID, userDoc, userData){
    currentUser = userID;
    currentUserDoc = userDoc;
    currentUserData = userData;
  }

function realTimeDB(){
  //get first value read, to set as filter min
  var firstValRef = database.ref('sensor/'+sensorID).limitToFirst(1);
  //get last value read, to set as filter max (neccessary when no realtime data are streaming)
  var lastValRef = database.ref('sensor/'+sensorID).limitToLast(1);
  //get 40 last readings of today, to initially set up graphs
  var initData = database.ref('sensor/'+sensorID).orderByChild('time').startAt(getTodayDate()).limitToLast(numDataPoints);
  //realtime ref listening to newly added childre
  var reaTimeRef = database.ref('sensor/'+sensorID).orderByChild('time').startAt(getTodayDate()).limitToLast(1);

  firstValRef.once('value', setFirstDate, errData);// @dataStreaming-DateFilteration.js
  lastValRef.once('value', setLastDate, errData);// @dataStreaming-DateFilteration.js
  initData.once('value', initDataSetup, errData);
  reaTimeRef.on('value', function(data) {
    addNewData(data);
  }, errData);
}

function read() {
    const promise = firestore.collection("Models").doc(assetModel).get();
    const p1 = promise.then( snapshot => {
      const model = snapshot.data();
      assetInfo(model);
      const promise2 = firestore.collection("Models").doc(assetModel).collection("Assets").doc(assetID).get();
      const p2 = promise2.then( snapshot2 => {
          const d = snapshot2.data();
          var issues = d['issue'];
          sensorID = d['sensorID'];
          incidents(issues);
          incidentsGraph(issues);
          realTimeDB();
        });
    p2.catch(error =>{
      console.log("Error"+error);
    })
  });
  p1.catch(error =>{
    console.log("Error"+error);
  });
}


function addNewData(data){
    if(streamingTemp){
      tempData(data,dataSteps);
      // tempretureLineChart.config.data.labels.shift();
      // tempretureLineChart.config.data.datasets[0].data.shift();
    }
    if(streamingMotion){
      motionData(data,dataSteps);
      // motionLineChart.config.data.labels.shift();
      // motionLineChart.config.data.datasets[0].data.shift();
    }
    setLastDate(data);
}

function initDataSetup(data){
    tempData(data,numDataPoints);
    motionData(data,numDataPoints);
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
   document.getElementById('info-type').innerHTML = data['type'];
   document.getElementById('info-make').innerHTML = data['make'];
   document.getElementById('info-model').innerHTML = assetModel;
   $("#asset-manual").attr("href", data['manual']);
   $("#asset-icon").attr("src", data['icon']);
}


function incidents(data){
  issues = sortIncidents(data);
  var total = [];
  var status = "";
  var severity = "";
  var text = "";
  for (var i=0;i<incTableMax&&i<issues.length;i++){
  var issue = issues[i];
      switch(issue['severity'].toUpperCase()){//severities
        case "HIGH": severity = '<td class="uk-width-1-10 uk-text-nowrap"><small style="color: RGBA(233,89,16,0.75)">HIGHT</small></span></td>';
        total[total.length]= "HIGH";
        break;
        case "MEDIUM": severity = '<td class="uk-width-1-10 uk-text-nowrap"><small style="color: RGBA(253,183,5,1)"><small>MEDIUM</small></span></td>';
        total[total.length]= "MEDIUM";
        break;
        case "LOW": severity = '<td class="uk-width-1-10 uk-text-nowrap"><small style="color: rgba(250,214,12,1)"><small>LOW</small></span></td>';
        total[total.length]= "LOW";
      }
      switch(issue['status'].toUpperCase()){//statuses
        case "HANDLED": if(issue["engID"] == currentUser){
                         status = '<td class="uk-width-4-10 uk-text-right"><button class="btn btn-amber btn-sm  float-right" onClick="abandon('+i.toString()+')">ABANDON</button>'
                         +'<button style="width :90px" class="btn btn-light-green btn-sm  float-right" onClick="resolve('+i.toString()+')">RESOLVE</button></td>';
                          }
                        else{
                          status = '<td class="uk-width-4-10 uk-text-right"><button style="width :90px" class="btn btn-primary btn-sm  float-right" disabled>HANDLED</button></td>';
                        }
        break;
        case "UNHANDLED": status = '<td class="uk-width-4-10 uk-text-right"><button style="width :90px;" class="btn btn-primary btn-sm  float-right" onclick="handle('+i.toString()+')">HANDLE</button></td>';
        break;
        case "RESOLVED": status = '<td class="uk-width-4-10 uk-text-right"><button style="width :90px;" class="btn btn-blue-grey btn-sm  float-right" disabled>RESOLVED</button></td>';

      }
      text = '<tr class="uk-table-middle" style="width :80px"><td class="uk-width-2-10 uk-text-nowrap"><small>'+timestampToString(issue['timestamp'])+'</small></td>'
      +severity
      +'<td class="uk-width-3-10 text-wrap"><small>'+issue['description']+'</small></td>'
      +status
      +'</tr>';
      document.getElementById('incident-table-body').innerHTML+=text;
    }
      if(issues.length<incTableMax){
        document.getElementById("incident-table-footer").remove();
      }
}

function sortIncidents(data){
  var result = [];
  var unhandled = [];
  var handled = [];
  var resolved = [];
  for(var i =0 ;i<data.length;i++){
    var temp = data[i];
    switch(temp['status'].toUpperCase()){
      case "UNHANDLED": unhandled.push(temp);
            break;
      case "HANDLED": handled.push(temp);
            break;
      case "RESOLVED": resolved.push(temp);
    }
  }
  //append to result oldest to latest
  for(var i = 0; i<unhandled.length ;i++){
    result.push(unhandled[unhandled.length-i-1]);
  }
  for(var i = 0; i<handled.length ;i++){
    result.push(handled[handled.length-i-1]);
  }
  for(var i= 0; i<resolved.length ;i++){
    result.push(resolved[resolved.length-i-1]);
  }
  return result;
}

function timestampToTime(data){
  var utcSeconds = data.seconds;
  var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
  date.setUTCSeconds(utcSeconds);
  return date;
}

function timestampToString(data){
  data = timestampToTime(data);
  return data.toString().substring(4, 15)+' - '+data.toString().substring(16, 21);
}

function incidentsGraph(issues){
  var high = 0;
  var medium = 0;
  var low = 0;
  for(var i=0;i<issues.length;i++){
    var issue = issues[i];
    switch(issue['severity'].toUpperCase()){
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
  if(data!=null){
    var reads = data.val();
    if(reads!=null){
      var keys = Object.keys(reads);
      for (var i=0; i<iter&&i<keys.length; i++){
         var k = keys[i];
         temp[temp.length] = Math.round( reads[k].temp * 10) / 10;
         time[time.length] = reads[k].time;
      }
          addTempData(time, temp);
    }
  }
}

function motionData(data,iter){
  var motion;
  var x = [];
  var y = [];
  var z = [];
  var time = [];
  if(data!=null){
    var reads = data.val();
    if(reads!=null){
      var keys = Object.keys(reads);
      for (var i=0; i<iter&&i<keys.length; i++){
         var k = keys[i];
         motion = reads[k].acc;
         x[x.length] = motion[0];
         y[y.length] = motion[1];
         z[z.length] = motion[2];
         time[time.length] = reads[k].time;
      }
        addMotionData(time, x, y, z);
    }
  }
}



function addTempData(label,data) {
for(var i=0; i<label.length;i++){
  tempretureLineChart.data.labels.push(label[i].substring(11, 19));
  tempretureLineChart.data.datasets.forEach((dataset) => {
          dataset.data.push(data[i]);
        });
      }
      if(counter=>numDataPoints){
        tempretureLineChart.data.labels.splice(0, 1); // remove first label
        tempretureLineChart.data.datasets[0].data.splice(0, 1);// remove first data point
      }
    tempretureLineChart.update();
}


function addMotionData(label, x, y, z){
  for(var i=0; i<label.length;i++){
    motionLineChart.data.labels.push(label[i].substring(11, 19));
    //updated once at motion since temp is added first
    counter++;
  }
    for(var j=0;j<x.length;j++){
      motionLineChart.data.datasets[0].data.push(x[j]);
      motionLineChart.data.datasets[1].data.push(y[j]);
      motionLineChart.data.datasets[2].data.push(z[j]);
    }
    if(counter=>numDataPoints){
      motionLineChart.data.labels.splice(0, 1); // remove first label
      motionLineChart.data.datasets[0].data.splice(0, 1);// remove first data point
      motionLineChart.data.datasets[1].data.splice(0, 1);
      motionLineChart.data.datasets[2].data.splice(0, 1);
    }
      motionLineChart.update();
  }

function errData(error){
 console.log("Error: "+ error);
}
