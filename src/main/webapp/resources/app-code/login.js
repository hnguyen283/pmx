/**
 * 
 */

$(document).ready(function(){
	$("#form_login").submit(function(e){
		e.preventDefault();
		
		$.ajax({
			url: base_URL+"/api/user/login",
			type: "POST",
			data: $(this).serialize(),
			success: function(data){
				var json = JSON.parse(data);
				if(json.result == "failed"){
					alertMessage(json.result + ": Login Failed with ID: "+json.detail);
				}
				if(json.result == "success"){
					alertMessage(json.result + ": Login Successfully with ID: "+json.detail.user_id);
					setTimeout(function(){
						window.location = base_URL;
					}, 1500);
				}
			}
		});
		
		return false;
	});
	
	$("#form_register").submit(function(e){
		e.preventDefault();
		$.ajax({
			url : base_URL + "/api/user/adduser",
			type : "POST",
			data : $(this).serialize(),
			success : function(data){
				var json = JSON.parse(data);
				if(json.result = "success"){
					alertMessage("Register user succesful");
					$("#modal_register").closeModal();
					window.location = base_URL + "/login";
				}
				else
					alertMessage("Register user fail");
			}
		});
		
		return false;
	});
	
	$(".btn_logout").click(function(e){
		e.preventDefault();
		
		$.ajax({
			url: base_URL+"/api/user/logout",
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				
				alertMessage(json.result+": "+json.detail);
				
				if(json.result == "success"){
					setTimeout(function(){
						window.location = base_URL;
					}, 1000);
				}
			}
		});
		
		return false;
	});
});