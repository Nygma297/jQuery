$(document).ready(function(){
	$("#form").on("submit", (function(e){
			console.log("Inside jQuery");
			var data = {
			name: $("#name").val(),
    		email: $("#email").val(),
			mobile:  $("#mobile").val()
			}
			console.log(data.name);
			console.log("\n\n\n\n\n\n\n\n",JSON.stringify(data));
			$.ajax({
				url : "/data",
				dataType: "application/JSON",
				data : JSON.stringify(data),
				processData:false,
				method:"POST",
				success: function(){
					console.log("Submitted");							
				}
			});

			$("#new").load("/ #cbdata");
			e.preventDefault();
		}));
})