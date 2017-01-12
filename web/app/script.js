$(() => {
    console.log("Inside jQuery")
	$("#getin").bind("click", ()=>{
		let data = {
			email:$("#email").val(),
			password: $("#password").val()
		}
		$.ajax({
			url:'/app/in',
			contentType: 'application/JSON',
			method:"GET",
			data:JSON.stringify(data),
			success: (r)=>{
				console.log(r);
			}
		});
	});

	$("#register").bind("click", ()=>{
		let data ={
			name:$("#name").val(),
			pwd: $("#pwd").val(),
			cpwd: $("#cpwd").val(),
			email:$("#email").val,
			mobile:$("#mobile").val()
		}
		$.ajax({
			url:'/app/register',
			contentType: 'application/JSON',
			method:"GET",
			data:JSON.stringify(data),
			success: (r)=>{
				console.log("User Registered");
			}
		});
	})
	
	$("#show").bind("click", () =>{ 

		$.ajax({
			url:'/app/user/contacts',
			contentType: 'application/JSON',
			method:"GET",
			success: (response)=>{
				$("#show").hide(1000);
				console.log(response);
				console.log("Users:");
				response.forEach((value)=>{
					let contacts = $('contacts');
					contacts.append(`<b>${value.name}</b> <br/>
						<b>${value.email}</b> <br/>
						<b>${value.mobile}</b> <br/>
  	  					<button type = "button" id="delete" value="${value._id}" >Delete</button>
					`);	
				})
			}
		});
		
	})

	$( "#store" ).bind( "click", ()=> {
		console.log("Email " + $('#femail').val()+'Logged into database');
       	let data = {
           	name: $('#fname').val(),
           	email: $('#femail').val(),
           	mobile: $('#fmobile').val(),    
       	}
       	$.ajax({
           	url: '/app/user/save',
           	contentType: 'application/JSON',
           	method: 'POST',
           	data: JSON.stringify(data),
           	success:  ()=> {
               	console.log("Submitted");
			}
       	});
		   $("#show").click();
	});

});