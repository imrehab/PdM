/*=================FOR TESTING PURPOSES, TO BE REMOVED================*/
var currentEmail = "salnaser@um.sa";
var currentUserDoc;
/*====================================================================*/


firestore.collection('engineers')
    .where('email', '==', currentEmail)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            currentUserDoc = doc;
        });
    });

var assetDocs = [];


$(document).ready(function() {

    var assetIndex = 0;

    firestore.collection("Models").doc("IPOWERFAN").collection("Assets").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var asset = doc.data();
            var assetID = doc.id;
            var issues = asset.issue;

            assetDocs.push(doc);

            issues.forEach(function(issue, issueIndex) {

                var assetID = doc.id;
                var timeDiff = ((issue.timestamp) ? getTimeDiff(issue.timestamp.toDate()) : '');
                var severity = (issue.severity ? issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1).toLowerCase() : '');
                var status = (issue.status ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1).toLowerCase() : '');

                if (issue.status.toUpperCase() == "UNHANDLED") {
                    $('#page_content_inner').append('<div class="uk-grid">\n' +
                        '                        <div class="uk-width-medium-2-2">\n' +
                        '                            <div class="md-card">\n' +
                        '                                <div class="md-card-content">\n' +
                        '                                    <ul class="md-list md-list-addon uk-margin-remove">\n' +
                        '                                        <li>\n' +
                        '                                             <div class="timeline_icon timeline_icon_warning"><i class="material-icons">warning</i></div>\n' +
                        '                                            \n' +
                        '                                            <div class="md-list-content">\n' +
                        '                                    <div class="uk-flex uk-flex-middle">\n' +
                        '                                                    <div class="uk-width-9-10">\n' +
                        '                                                      \n' +
                        '                                                            <span class="uk-text-muted">' + timeDiff + '</span>\n' +
                        '                                                            <p class="uk-margin-remove">Asset ID: ' + assetID + '</p>\n' +
                        '                                                            <p class="uk-margin-remove">Alert Severity: ' + severity + '</p>\n' +
                        '                                                            <p class="uk-margin-remove">Status: ' + status + '</p>\n' +
                        '                                                            <p class="uk-margin-remove"><strong>Asset has incosistent blade rotation</strong></p>\n' +
                        '                                                    </div>\n' +
                        '                                      \n' +
                        '                                    <div class="uk-width-large-1-10">\n' +
                        '                                            <a class="md-btn md-btn-success md-btn-wave-light" onClick="resolve(' + assetIndex + ',' + issueIndex + ')">RESOLVE</a>\n' +
                        '                                    </div>\n' +
                        '                                                </div>\n' +
                        '                                            </div>\n' +
                        '                                   </li>\n' +
                        '                                    </ul>\n' +
                        '                                      \n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                      </div>');
                } else {
                    $('#page_content_inner').append('<div class="uk-grid">\n' +
                        '                        <div class="uk-width-medium-2-2">\n' +
                        '                            <div class="md-card">\n' +
                        '                                <div class="md-card-content">\n' +
                        '                                    <ul class="md-list md-list-addon uk-margin-remove">\n' +
                        '                                        <li>\n' +
                        '                                            <div class="timeline_icon timeline_icon_success"><i class="material-icons">bar_chart</i></div>\n' +
                        '                                            <div class="uk-width-8-10">\n' +
                        '\n' +
                        '                                                <span class="uk-text-muted">' + timeDiff + '</span>\n' +
                        '                                                <p class="uk-margin-remove">Asset ID: ' + assetID + '</p>\n' +
                        '                                                <p class="uk-margin-remove"><strong>Asset behavior is back to normal</strong></p>\n' +
                        '                                            </div>\n' +
                        '                                        </li>\n' +
                        '                                    </ul>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>');
                }


            })
            assetIndex++;

        });
    });
});

function resolve(assertIndex, issueIndex) {
    if (!currentUserDoc)
      return;
    var currentUser = currentUserDoc.data();
    if (!currentUser)
      return;
    var assetDoc = assetDocs[assertIndex];
    if (!assetDoc)
      return;
    var asset = assetDoc.data();
    if (!asset)
      return;
    var issue = asset.issue[issueIndex];
    if (!issue)
      return;
    ////////////////////////
    if (!confirm("Do you want to solve this issue?"))
      return;

    issue.status = "HANDLED";
    issue.engID = currentUserDoc.id;

    //update asset
    firestore.collection("Models").doc("IPOWERFAN").collection("Assets").doc(assetDoc.id).set(asset);

    //user Engineer
    currentUser.issues.push(issue);
    firestore.collection("engineers").doc(currentUserDoc.id).set(currentUser);

}
