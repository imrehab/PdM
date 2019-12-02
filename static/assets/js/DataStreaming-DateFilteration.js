//FILTER DATA

//INITAL ASSIGNING
$(document).ready(function() {
  var today = todayDate();
  $(".date-input").attr("value", today);
  $(".date-input").attr("max", today);
  $(".date-input").attr("min", minDate());
});

$(".date-input").change(function(){
  var date = this.value;
  console.log("date value"+date);
  if(date.toString()==todayDate()){
    return;
  }
});

function todayDate(){
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

function minDate(){
  return firstValDate;
}

$(".date-input").blur(function toggleDateInput(){
    if(this.value==""){
      this.value = todayDate();
    }
});

/*
$(".date-input").focus(function toggleDateInput(){
    this.type='date';
    this.max=todayDate();
    this.min=minDate();
});
*/

// //TRIGGER WHEN AN INPUT IS RECIEVED
// $("#tempDate").(function toggleDateInput(){
//     console.log("input triggered");
//     this.type='text';
//     this.min="";
//     this.max="";
// });
