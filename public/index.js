$(document).ready(function(){

  $( "#dialog" ).dialog({ autoOpen: false,resizable: false, modal: true, width:'500px', });


  $("#showButton").click(function(){
    if ($.isNumeric($("#showStructures").val()) && $("#showStructures").val() < 793){

      $.ajax({
        url: '/structure',
        type: 'POST',
        data: 'id=' + $("#showStructures").val(),
        success: function(data) {
          var msg = "";
          if (data == "Error"){
              msg= "No structure with that ID";
              alert(msg);
          }
          else {
            msg = 	"Strucures id:" + data.id + "<br/>"
                + "Name : " + data.rps_no + "<br/>"
                + "Description : " + data.structurename + "<br/>"
                + "Street No : " + data.description + "<br/>"
                + "Address : " + data.streetnumber + "<br/>"
                + "Townland : " + data.streetaddress + "<br/>"
                + "Lat : " + data.townland + "<br/>"
                + "Long : " + data.long + "<br/>"
                + "Lat : " + data.lat + "<br/>"
            $("#dialog-text").html(msg);
            $("#dialog").dialog("open");
          }
        }
      });
    } else {
      var msg= "No structure with that ID";
      alert(msg);
    }

  });
});
