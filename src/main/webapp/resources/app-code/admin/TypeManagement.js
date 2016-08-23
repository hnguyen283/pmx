/**
 * Nam Ta Type management
 */

function loadType() {
	$.ajax({
		url : base_URL + "/api/type/get",
		type : "GET",
		success : function(data) {
			var json = JSON.parse(data);
			console.log(json);
			var tbl_type = $("#table_type");
			
			tbl_type.find("tbody").empty();
			if (json.length > 0) {
				for (var i = 0; i< json.length; i++) {
					var row = '<tr>'
							+'<td>'
								+'<div class="input-field">'
									+'<input type="checkbox" name="listTypeId"'
									+'id="cb_'+json[i].type_id+'" value="'+json[i].type_id+'">' 
									+'<label for="cb_'+json[i].type_id+'"></label>'
								+'</div>'
							+'</td>'
							+'<td>'+json[i].type_name +'</td>'
							+'<td>'
							+ json[i].type_icon 
							+'</td>'
							+'<td>'
							+ json[i].type_description 
							+'</td>'
							+'<td>'
								+'<button class="waves-effect waves-light btn"'
								+'id="btn_edit" value="'+json[i].type_id+'">Edit<i class="fa fa-pencil right"></i></button>'
							+'</td>'
							+'</tr>';

					tbl_type.find("tbody").append(row);
				}
			} else {
				console.log("no type data");
			}
		}
	});
}

$(document).ready(function() {
	var statusType = "add";
	
	$('#bt_addType').click(function(e) {
		e.preventDefault;
		$("#h4_form").text("Add Type Form");
		statusType = "add";
		
		var modal = $("#editType");
		var form_type = modal.find("#addTypeForm");
		console.log(form_type);
		form_type[0].reset();
		modal.openModal();
		return false ;
	});

	$("#bt_DeleteType").click(function(e) {
		e.preventDefault();
		var table_type = $("#table_type");
		var listCheckBox = table_type.find(".input-field ");
		var listLbId = table_type.find(".lb_id");
		var btn_submit = $("#bt_submitDelete");

		listCheckBox.toggleClass("hide");
		btn_submit.toggleClass("hide");
		listLbId.toggleClass("hide");
		return false;
	});

	$('#form_type').submit(function(e) {
		e.preventDefault();
		
		var param = $(this).serialize();
		console.log(param);
		$.ajax({
			url : base_URL + "/api/type/delete",
			type : "POST",
			data : param,
			success : function(data) {
				var json = JSON.parse(data);

				alertMessage(json.result + ": " + json.detail);
				
				loadType();
				
				
			}
		});
		
		
		return false;
	});

	$('#addTypeForm').submit(function(e) {
		e.preventDefault();
		
		var param = $(this).serialize();
		console.log(statusType);
		var link = "";
		if(statusType == "add"){
			link = base_URL+"/api/type/addtype";
		}else {
			link = base_URL+"/api/type/update";
		}
		
		$.ajax({
			url : link,
			type : "POST",
			data : param,
			success: function(data){
				var json = JSON.parse(data);
				$("#editType").closeModal();
				alertMessage(json.result+": "+json.detail);
				
				loadType();
				
				
			}
		
		});
		
		
	});
	
	$(document).on("click", "#btn_edit", function(e){
		
		e.preventDefault();
		statusType = "update";
		var editModal = $("#editType");
		$("#h4_form").text("Edit Type Form");
		$.ajax({
			url: base_URL+"/api/type/select/"+$(this).val(),
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				if(json.result == "success"){
					editModal.find("#type_name").val(json.detail.type_name);
					editModal.find("#type_id").val(json.detail.type_id);
					editModal.find("#type_icon").val(json.detail.type_icon);
					editModal.find("#type_description").val(json.detail.type_description);
				}
				editModal.openModal();
			}
		});
		
	
		return false;
	});


});
