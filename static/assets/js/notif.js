function notifyUser(issueDetails) {

  //  check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  //  notification permissions have already been granted
  else if (Notification.permission === "granted") {
  
    // If it's okay let's create a notification
    var notification = new Notification(issueDetails);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
  
    Notification.requestPermission().then(function (permission) {

      //   user accepts 
      if (permission === "granted") {
        var notification = new Notification(issueDetails);
      }
    });
  }
 
}
