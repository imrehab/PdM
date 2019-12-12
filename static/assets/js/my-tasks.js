//===============GLOBAL VARIABLES==========================
var first_resolved = true;
var first_unresolved = true;

//FOR TESTING PURPOSES ONLY, TO BE REMOVED
var currentUser = "salnaser@um.sa";
 // var unresolved_block = document.getElementById('unresolved-issues');
 // var resolved_block = document.getElementById('resolved-issues');

 function read(){
   firestore.collection("Models").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {//for each model
          var model = doc.id;
         firestore.collection("Models").doc(model).collection("Assets").get().then(function(querySnapshot2) {
           querySnapshot2.forEach(function(doc2) {//for each asset
            var assetID = doc2.id;
            var issues = doc2.data().issue;
            for (var i=0; i<issues.length;i++) {
              var issue = issues[i];
              var engID = issue['engID'];
              if(engID==currentUser){
                var status = issue['status'].toUpperCase();
                if(status=="HANDLED"){
                  addUnresolved(issue,assetID);
                }
                else if(status=="RESOLVED"){
                  addResolved(issue,assetID);
                }
              }
            }

             });
           });
         });
       });
     }

function addUnresolved(issue,asset){
  var text = "";
  if(first_unresolved){
    text += firstUnresolved();
    first_unresolved = false;
  }
  text+= initiateTask(issue,asset);
    text += '<button type="button" class="btn btn-success btn-md mr-3">RESOLVE</button>'
  +'<button type="button" class="btn btn-danger btn-md">ABANDON</button>'
  +'</div>'
  +'</div>'
  +'</div>'
  +'</div>';
  document.getElementById('unresolved-issues').innerHTML+= text;
}

function addResolved(issue,asset){
  var text = "";
  if(first_resolved){
    text += firstResolved();
    first_resolved = false;
  }
  text+= initiateTask(issue,asset);
  text += '</div>'
+'</div>'
+'</div>'
+'</div>';
  document.getElementById('resolved-issues').innerHTML += text;
}
 function initiateTask(issue,asset){
   var text = '<div class="md-card shadow p-3 mb-5 bg-white rounded">'
              +'<div class="md-card-content align-items-center">'
              +' <div class="row align-items-center">'
              +'<div class="col-auto d-inline">';
      text +=getIcon(issue['severity'].toUpperCase());
      text +='</div>'
              +'<div class="col d-inline">'
              +'<div>'
              +'<span class="text-muted">ASSET ID: </span><span class="font-weight-normal">'+asset+'</span>'
              +'</div>'
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
function firstResolved(){
  var text = "";
  text += '<div class="container-sm  border-bottom  mb-3">'
        +'<span class="font-weight-bold text-muted col">RESOLVED ISSUES</span>'
        +'</div>';
  return text;
}
function firstUnresolved(){
  var text = "";
  text += '<div class="container-sm  border-bottom  mb-3">'
        +'<span class="font-weight-bold text-muted col">UNRESOLVED ISSUES</span>'
        +'</div>';
  return text;
}
