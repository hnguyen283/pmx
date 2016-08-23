/**
 * Nguyen Ngoc Hung
 */
$(document).ready(function(){

	var sizePagination = 5;
	
	var currentPage = 1;
	
	$(document).ready(function(){
		getProduct(currentPage);
		getPaginationItem(currentPage);
	});
	
	function getProduct(number_page){
		if(number_page == 1)
			loadItem(0);
		else
			loadItem((number_page - 1)* sizePagination);
		
	}
	
	function getPaginationItem(activePagination){
		$.ajax({
			url : base_URL + "/api/product/getNumberPage",
			type : "GET",
			typeData : 'json',
			data : ({sizePagination : sizePagination}), 
			success : function(data){
				json = JSON.parse(data);
				if(json.deatail != "" || json.detail != undefined){
					var pagination = $(".pagination");
					pagination.empty();
					if(activePagination == 1)
						pagination.append(
								'<li class="disabled">' 
								+ '<a href="#" id="chevron_left">'
								+ '<i class="material-icons">chevron_left</i>' 
								+ '</a></li>');
					else
						pagination.append(
								'<li class="waves-effect">' 
								+ '<a href="#" id="chevron_left">'
								+ '<i class="material-icons">chevron_left</i>' 
								+ '</a></li>');
					for(var i = 1; i <= json.detail; i++){
						if(i == activePagination)
							pagination.append(
								'<li class="active">'
								+ '<a href="#" id="element">'
								+ i
								+ '</a></li>');
						else
							pagination.append(
									'<li class="waves-effect">'
									+ '<a href="#" id="element">'
									+ i
									+ '</a></li>');
					}
					if(json.detail == activePagination)
						pagination.append(
								'<li class="disabled">'
								+ '<a href="#" id="chevron_right">'
								+ '<i class="material-icons">chevron_right</i>' 
								+ '</a></li>');
					else
						pagination.append(
								'<li class="waves-effect" id="li_chevron_right">'
								+ '<a href="#" id="chevron_right">'
								+ '<i class="material-icons">chevron_right</i>' 
								+ '</a></li>');
					$(".pagination li #element").click(function(){
						var size = $(this).html();
						currentPage = size;
				    	getProduct(size);
				    	getPaginationItem(size);
				    });
					$(".pagination #chevron_right").click(function(){
				    	if(activePagination < json.detail){
				    		currentPage = +activePagination + 1;
				    		getProduct(currentPage);
				    		getPaginationItem(currentPage);
				    	}
				    });
					$(".pagination #chevron_left").click(function(){
				    	if(activePagination > 1){
				    		currentPage = activePagination - 1;
				    		getProduct(currentPage);
				    		getPaginationItem(currentPage);
				    	}
				    });
				}
			}
		});
		return false;
	}
	
	var itemType;
	
    $('#btn_add').click(function(e){
    	e.preventDefault();
    	$("#h4_form").text("Add Item Form");
    	itemType = "add";
    	
    	var modal = $("#modal_item");
    	var form_item = modal.find("#form_item");
    	
    	form_item[0].reset();
    	
    	modal.openModal();
    	
    	return false;
    	
    });
    
    $(document).on("click", ".btn-edit", function(e){
    	e.preventDefault();
    	itemType = "update";
    	$("#h4_form").text("Edit Item Form");
    	var itemId = $(this).val();
    	
    	$.ajax({
    		url : base_URL
    				+ "/api/product/select/"
    				+ itemId,
    		type : "GET",
    		success : function(data){
    			var json = JSON.parse(data);
    			var form_item = $("#form_item");
				var modal_item = $("#modal_item");
				
				if (form_item != undefined) {
					for ( var key in json) {
						if (json
								.hasOwnProperty(key)) {
							if (json[key] != undefined
									&& json[key] != "") {
								form_item
										.find(
												"input[name="
														+ key
														+ "]")
										.val(
												json[key]);
								form_item
										.find("textarea[name="
														+ key
														+ "]")
										.val(
												json[key]);
								form_item
										.find('.select-dropdown').attr("value", json[key].type_name);
							}
						}
					}
				}
				
				modal_item.openModal();
    		}
    	});
    	return false;
    });

    $("#form_item").submit(function(e){
    	e.preventDefault();
    	var formData = $(this).serialize();
    	var link = "";
    	if (itemType == "add") {
			link = base_URL
					+ "/api/product/create";
		} else {
			link = base_URL
					+ "/api/product/update";
		}
    	
    	$.ajax({
    		url : link,
    		data : formData,
    		type : "POST",
    		success : function(data){
    			var json = JSON.parse(data);
    			$("#modal_item").closeModal();
    			if(itemType == "add")
    				currentPage = 1;
    			alertMessage(json.result + ": " + json.detail);
    			if(json.result == "add"){
    				getProduct(1);
    				getPaginationItem(1);
    			}else{
    				getProduct(currentPage);
    				getPaginationItem(currentPage);
    			}
    				
    		}
    	})
    });
    
    $('#bt_Delete').click(function(e) {
		e.preventDefault();
		$("#modalCommitDelete").openModal();
		return false;
	});
    
    $('#bt_submitDelete').click(function(e) {
		e.preventDefault();
		var param = $("#form_tableItem").serialize();
		$.ajax({
			url : base_URL + "/api/product/delete",
			type : "POST",
			data : param,
			success : function(data) {
				var json = JSON.parse(data);
				if(json.length > 0){
					for(var i = 0; i < json.length; i++){
						if(json[i] == "Done")
							alertMessage("Success delete item");
						else
							alertMessage("Can't delete item");
					}
						
				}else
					alertMessage("Error " + ": " + " Delete fail");
				getPaginationItem(currentPage);
				getProduct(currentPage);
			}
		});

		return false;
	});
    
    function loadItem(start){
    	var table_item = $("#itemTable");
    	$.ajax({
    		url : base_URL + "/api/product/getPagination",
    		type : "GET",
    		typeData : 'json',
			data : ({start : start, sizePagination : sizePagination}),
    		success: function(data){
    			var json = JSON.parse(data);
    			table_item.find("tbody").empty();
    			if(json.length > 0){
    				for(var i = 0; i < json.length; i++){
    					var row = '<tr>'
    							+ '<td>'
    							+ '<div class="input-field">'
    							+ '<input type="checkbox" id="item_'
    							+ json[i].item_id
    							+ '" name="listItemId" value="'
    							+ json[i].item_id
    							+ '"> <label '
								+ 'for="item_'
								+ json[i].item_id
								+ '"></label>'
    							+ '</div>'
    							+ '</td>'
    							
    							+ '<td>'
    							+ json[i].item_owner
    							+ '</td>'
    							+ '<td>'
    							+ json[i].item_name
    							+ '</td>'
    							+ '<td>'
    							+ json[i].item_description
    							+ '</td>'
    							+ '<td>'
    							+ json[i].item_describe
    							+ '</td>'
    							+ '<td>'
    							+ json[i].tbl_type.type_name
    							+ '</td>'
    							+ '<td>'
    							+ '<button class="btn wave-effect wave-light btn-edit"  style="width:130px" value="'
    							+ json[i].item_id
    							+ '"> Edit <i class="fa fa-pencil right"></i>'
    							+ '</button>'
    							+ '</td>'
    							+ '</tr>';
    					table_item.find("tbody").append(row);
    				}
    			}else
    				console.log("no item data");
    		}
    	});
    }
  });