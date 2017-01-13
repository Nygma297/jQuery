$(() => {
    console.log("Inside jQuery")
	$("#getin").bind("click", ()=>{
		console.log("Getting inserted data");
		let data = {
			username:$("#email").val(),
			password: $("#password").val()
		}
		$.ajax({
			url:'/app/login',
			contentType: 'application/JSON',
			method:"POST",
			data:JSON.stringify(data),
			success: (r)=>{
				console.log(r);
		        window.location.href = "/app/home";
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
				console.log("Users:");
				console.log(JSON.stringify(response));
				let i=1;
				response.forEach((value)=>{
					let contacts = $('contacts');
					contacts.append(`<center>${i}. ${value.name}<br/> 
						<b>Email: ${value.email}</b> <br/>
						<b>Cell: +${value.mobile}</b> <br/>
  	  					<button type = "button" id="delete" value="${value._id}" >Delete</button></center><br/><br/>
					`);	i++;
					$("b").css("color", "white");
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

	$("#delete").bind("click", ()=>{
		let x = this.attr("value");
		console.log("Deleteing contact with ID:")
	})

});