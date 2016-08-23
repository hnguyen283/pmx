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
				
				alertMessage(json.result + ": Login Successfully with ID: "+json.detail.user_id);
				
				if(json.result == "success"){
					setTimeout(function(){
						window.location = base_URL+"/admin/";
					}, 1500);
				}
			}
		});
		
		return false;
	});
	
	$("#form_register").submit(function(e){
		e.preventDefault();
		console.log("comming here");
		
		return false;
	});
	
	$("#form_login_static").submit(function(e){
		e.preventDefault();
		$.ajax({
			url: base_URL+"/api/user/login",
			type: "POST",
			data: $(this).serialize(),
			success: function(data){
				var json = JSON.parse(data);
				
				alertMessage(json.result + ": "+json.detail);
				
				if(json.result == "success"){
					setTimeout(function(){
						window.location = document.URL;
					}, 1500);
				}else{
					$("#modal_login").closeModal();
				}
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
						window.location = base_URL+"/admin";
					}, 1000);
				}
			}
		});
		
		return false;
	});
});