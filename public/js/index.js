$(document).ready(function(){
  $("#showButton").click(function(){
    if ($.isNumeric($("#showStructures").val())){
      $.ajax({
        url: '/compare',
        type: 'POST',
        data: 'id=' + $("#showStructures").val(),
        success: function(data) {
          var msg = "";
          if (data == "Error"){
              msg= "No structure with that ID";
              alert(msg);
          }
          else {
            msg = 	"Structure id:" + data.struct_id + "<br/>"
                + "Name : " + data.struct_name + "<br/>"
                + "Description : " + data.struct_desc + "<br/>"
                + "Street No : " + data.struct_lat + "<br/>"
                + "Address : " + data.struct_long + "<br/>"
                + "Stop name : " + data.stop_name + "<br/>"
                + "Stop lat : " + data.stop_lat + "<br/>"
                + "Stop long : " + data.stop_long + "<br/>"
                + "Stop time : " + data.stop_time + "<br/>"
            $("#dialog-text").html(msg);
            $("#dialog").dialog("open");
          }
        }
      });
    }
  });
});
