//==============FOR TESTING PURPOSES, TO BE REMOVED==============
var assetModel = "IPOWERFAN";
var currentUser = "salnaser@um.sa";
//==============GLOBAL VARIABLES===============
let assetID = window.getAssetID();
var first_unhandled = true;
var first_handled = true;
var first_resolved = true;


function read(){
    const promise = firestore.collection("Models").doc(assetModel).collection("Assets").doc(assetID).get();
    const p1 = promise.then( snapshot => {
        var issues = snapshot.data().issue;
        appendIssues(issues);
      });
  p1.catch(error =>{
    console.log("Error"+error);
  });
}

function appendIssues(issues){
  for(var i=0; i<issues.length; i++){
    var issue = issues[i];
    console.log("issue: "+issue);
    switch(issue['status'].toUpperCase()){
      case "UNHANDLED": appendUnhandled(issue);
        break;
      case "HANDLED": appendHandled(issue);
        break;
      case "RESOLVED": appendResolved(issue);
        break;
    }
  }
}

function appendUnhandled(issue){
  var text = "";
  if(first_unhandled){
    text += firstUnhandled();
    first_unhandled = false;
  }
  text += initiateIssues(issue);
  text += '<button type="button" class="btn btn-primary">HANDLE</button>'
+'</div>'
+'</div>'
+'</div>'
+'</div>';
  document.getElementById('unhandled-issues').innerHTML+= text;
}

function appendHandled(issue){
  var text = "";
  if(first_handled){
    text += firstHandled();
    first_handled = false;
  }
  text +=  initiateIssues(issue);
  if(issue['engID']==currentUser){
    text += '<button type="button" class="btn btn-success btn-md  mr-3">RESOLVE</button>'
  +'<button type="button" class="btn btn-danger btn-md">ABANDON</button>'
  }
  else{
    text+= '<button type="button" class="btn btn-md btn-primary" disabled>HANDLED</button>'
  }
  document.getElementById('handled-issues').innerHTML+= text;
}

function appendResolved(issue){
  var text = "";
  if(first_resolved){
    text += firstResolved();
    first_resolved = false;
  }
  text +=  initiateIssues(issue);
  text += '</div>'
+'</div>'
+'</div>'
+'</div>';
  document.getElementById('resolved-issues').innerHTML+= text;
}

function initiateIssues(issue){
  var text = '<div class="md-card shadow p-3 mb-5 bg-white rounded">'
             +'<div class="md-card-content align-items-center">'
             +' <div class="row align-items-center">'
             +'<div class="col-auto d-inline">';
     text +=getIcon(issue['severity'].toUpperCase());
     text +='</div>'
             +'<div class="col d-inline">'
             +'<div>'
             +'<span class="text-muted">SEVERITY: </span><span class="font-weight-normal">'+issue['severity'].toUpperCase()+'</span>'
             +'</div>'
             +'<div>'
             +'<span class="text-muted">'+issue['description']+'</span>'
             +'</div>'
             +'<img src="../static/assets/img/clock-icon.png">';
     text+= getTimeAgo(issue['timestamp'].seconds);
     text+= '</div>'
           +'<div class="col-auto d-inline">';
  return text;
}
function getIcon(severity){
  var text = "";
  switch(severity){
    case "HIGH": text+= '<img src="../static/assets/img/severity-high.png">';
     break;
    case "MEDIUM": text+= '<img src="../static/assets/img/severity-medium.png">';
     break;
    case "LOW": text+= '<img src="../static/assets/img/severity-low.png">';
     break;
  }
  return text;
}
function getTimeAgo(time){
  var text = "";
  text += '<span class="text-muted">';
  text +=getTimeDiff(time);
  console.log("time diff: "+getTimeDiff(time));
  text += '</span>';
  return text;
}

function firstHandled(){
  var text = "";
  text += '<div class="container-sm  border-bottom  mb-3">'
        +'<span class="font-weight-bold text-muted col">UNRESOLVED ISSUES</span>'
        +'</div>';
  return text;
}
function firstUnhandled(){
  var text = "";
  text += '<div class="container-sm  border-bottom  mb-3">'
        +'<span class="font-weight-bold text-muted col">UNHANDLED ISSUES</span>'
        +'</div>';
  return text;
}
function firstResolved(){
  var text = "";
  text += '<div class="container-sm  border-bottom  mb-3">'
        +'<span class="font-weight-bold text-muted col">RESOLVED ISSUES</span>'
        +'</div>';
  return text;
}
