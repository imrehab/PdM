//===================FOR TESTING PURPOSE, TO BE REMOVED==============
var model = "IPOWERFAN";

//=================GLOBAL VARIABLES==============


function abandon(index) {
    var issue = issues[index];
    if (!prompt("Please enter the reason of abandonment:")) return;
    issue.status = "UNHANDLED";
    issue.engID = "";
    //remove issue from engineer
    var userIssues = currentUserData['issues'];
    for (var i=0; i<userIssues.length;i++) {
      var userIssue = userIssues[i];
        if (userIssue['issueID'] == issue['issueID']) {
            currentUserData['issues'].splice(i, 1);
        }
    }
    //update Engineer
    firestore.collection("engineers").doc(currentUserDoc.id).set(currentUserData);
    //update asset
    firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetID).get().then(function(doc) {
        var asset = doc.data();
        var assetIssues = asset['issue'];
        for (var i=0;i<assetIssues.length;i++){
          var assetIssue = assetIssues[i];
            if (assetIssue['issueID'] == issue['issueID']) {
                asset.issue.splice(i, 1);
                asset.issue.splice(i, 0, issue);
                firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetID).set(asset);
                location.reload();
            }
        }
    });
}

function handle(index) {
    var issue = issues[index];
    if (!confirm("Do you want to handle this issue?")) return;
    issue.status = "HANDLED";
    issue.engID = currentUser;
    //update Engineer
    currentUserData.issues.push(issue);
    firestore.collection("engineers").doc(currentUserDoc.id).set(currentUserData);
    //update asset
    firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetID).get().then(function(doc) {
        var asset = doc.data();
        var assetIssues = asset['issue'];
        for (var i=0;i<assetIssues.length;i++){
          var assetIssue = assetIssues[i];
            if (assetIssue['issueID'] == issue['issueID']) {
                asset.issue.splice(i, 1);
                asset.issue.splice(i, 0, issue);
                firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetID).set(asset);
                location.reload();
            }
        }
    });
//location.reload();
}

function resolve(index) {
    var issue = issues[index];
    if (!confirm("Do you mark this issue as resolved?")) return;
    //update issue in asset issues
    issue.status = "RESOLVED";

    //update Engineer
    firestore.collection("engineers").doc(currentUserDoc.id).set(currentUserData);
    //update asset
    firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetID).get().then(function(doc) {
        var asset = doc.data();
        var assetIssues = asset['issue'];
        for (var i=0;i<assetIssues.length;i++){
          var assetIssue = assetIssues[i];
            if (assetIssue['issueID'] == issue['issueID']) {
                asset.issue.splice(i, 1);
                asset.issue.splice(i, 0, issue);
                firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetID).set(asset);
                location.reload();
            }
        }
    });
}
