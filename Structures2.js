$(document).ready(function(){
	// hiding div
	$( "#dialog" ).dialog({ autoOpen: false,resizable: false, modal: true, width:'500px', });

	$("#showButton").click(function(event){
		if ($.isNumeric($("#showDiamondId").val())){
			//window.location.href = "/GET/" + $("#showDiamondId").val();

			$.ajax({
				url: '/diamond',
				type: 'POST',
				data: 'id=' + $("#showDiamondId").val(),
				success: function(data) {
					var msg = "";
					if (data == "Error"){
						msg = "This record doesn't exists...";
						alert(msg);
					}
					else {
						msg = 	"Diamond id:" + data.id + "<br/>"
								+ "Carat : " + data.carat + "<br/>"
								+ "Cut : " + data.cut + "<br/>"
								+ "Color : " + data.color + "<br/>"
								+ "Clarity : " + data.clarity + "<br/>"
								+ "Depth : " + data.depth + "<br/>"
								+ "Table : " + data.table + "<br/>"
								+ "Price : " + data.price + "<br/>"
								+ "X : " + data.x + "<br/>"
								+ "Y : " + data.y + "<br/>"
								+ "Z : " + data.z + "<br/>";
						$("#dialog-text").html(msg);
						$("#dialog").dialog("open");
					}
				}
			});
		}
	});
});
