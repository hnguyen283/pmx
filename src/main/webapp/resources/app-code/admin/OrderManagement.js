/**
 * Nhut Nguyen Order Management
 */

$(document).ready(function() {
	var orderType;
//
//	$("#btn_delete").click(function(e) {
//		e.preventDefault();
//		var table_order = $("#table_order");
//		console.log(table_order);
//		var btn_submit = table_order.find("#btn_submit");
//		// var btn_createOrder =
//		// table_order.find("#btn_createOrder");
//		var listLbId = table_order.find(".lb_id");
//		var listCheckBox = table_order.find(".input-field");
//
//		console.log(listLbId);
//
//		listLbId.toggleClass("hide");
//		listCheckBox.toggleClass("hide");
//		// btn_createOrder.toggleClass("hide");
//		btn_submit.toggleClass("hide");
//		return false;
//	});

	$("#form_tableOrder").submit(function(e) {
		e.preventDefault();
		var param = $("#form_tableOrder").serialize();
		console.log(base_URL + "/api/order/delete");
		$.ajax({
			url : base_URL + "/api/order/delete",
			type : "POST",
			data : param,
			success : function(data) {
				var json = JSON.parse(data);

				alertMessage(json.result + ": " + json.detail);

				if (json.result == "success") {
					loadOrder();
				}
			}
		});

		return false;
	});

	$(document).on("click",".btn-edit",function(e) {
		e.preventDefault();
		orderType = "edit";

		var orderId = $(this).val();

		$.ajax({
			url : base_URL
					+ "/api/order/select/"
					+ orderId,
			type : "GET",
			success : function(data) {
				var json = JSON
						.parse(data);

				var form_order = $("#form_order");
				var modal_order = $("#modal_order");

				if (form_order != undefined) {
					for ( var key in json) {
						if (json
								.hasOwnProperty(key)) {
							if (json[key] != undefined
									&& json[key] != "") {
								form_order.find("input[name="+ key+ "]").val(json[key]);
							}
						}
					}
					
					
				}

				modal_order.openModal();
			}
		});

		return false;
	});

	$("#btn_add").click(function(e) {
		e.preventDefault();

		orderType = "add";

		var modal = $("#modal_order");
		var form_order = modal.find("#form_order");

		form_order[0].reset();

		modal.openModal();

		return false;
	});

	$("#form_order").submit(
		function(e) {
			e.preventDefault();
			var formData = $(this).serialize();

			var link = "";

			if (orderType == "add") {
				link = base_URL
						+ "/api/order/create";
			} else {
				link = base_URL
						+ "/api/order/update";
			}

			$.ajax({
					url : link,
					data : formData,
					type : "POST",
					success : function(data) {
						var json = JSON.parse(data);

						$("#modal_order").closeModal();

						alertMessage(json.result + ": success ID: " + json.detail.order_id);

						if (json.result == "success") {
							if (orderType == "add") {
								var newRow = '<tr>'
										+ '<td>'
										+ '<div class="input-field hide">'
										+ '<input type="checkbox" id="cb_'
										+ json.detail.order_ID
										+ 'name="listOrderId" value="'
										+ json.detail.order_id
										+ '"> <label'
										+ 'for="cb_'
										+ json.detail.order_id
										+ '"></label>'
										+ '</div> <label class="lb_id">'
										+ json.detail.order_id
										+ '</label>'
										+ '</td>'
										+ '<td>'
										+ json.detail.order_date
										+ '</td>'
										+ '<td>'
										+ json.detail.customer_name
										+ '</td>'
										+ '<td>'
										+ json.detail.customer_phone
										+ '</td>'
										+ '<td>'
										+ json.detail.order_total
										+ '</td>'
										+ '<td>'
										+ '<button class="btn wave-effect wave-light btn-edit"'
										+ 'value="'
										+ json.detail.order_id
										+ '">'
										+ 'Edit <i class="material-icons left">settings</i>'
										+ '</button>'
										+ '</td>'
										+ '</tr>';
								console.log(newRow);
								$("#table_order").find("tbody").append(newRow);
							} else {
								loadOrder();
							}
						}
					}
				});

			return false;
		});

	function loadOrder() {
		var table_order = $("#table_order");

		$.ajax({
			url : base_URL + "/api/order/get",
			type : "GET",
			success : function(data) {
				var json = JSON.parse(data);

				table_order.find("tbody").empty();
				console.log(json);
				if (json.length > 0) {
					for ( var i = 0;i< json.length;i++) {
						var row = '<tr>'
								+ '<td>'
								+ '<div class="input-field hide">'
								+ '<input type="checkbox" id="cb_'
								+ json[i].order_id
								+ 'name="listOrderId" value="'
								+ json[i].order_id
								+ '"> <label'
								+ 'for="cb_'
								+ json[i].order_id
								+ '"></label>'
								+ '</div> <label class="lb_id">'
								+ json[i].order_id
								+ '</label>'
								+ '</td>'
								+ '<td>'
								+ json[i].order_date
								+ '</td>'
								+ '<td>'
								+ json[i].customer_name
								+ '</td>'
								+ '<td>'
								+ json[i].customer_phone
								+ '</td>'
								+ '<td>'
								+ json[i].order_total
								+ '</td>'
								+ '<td>'
								+ '<button class="btn wave-effect wave-light btn-edit"'
								+ 'value="'
								+ json[i].order_id
								+ '">'
								+ 'Edit <i class="material-icons left">settings</i>'
								+ '</button>'
								+ '</td>'
								+ '</tr>';

						table_order.find("tbody")
								.append(row);
					}
				} else {
					console.log("no order data");
				}
			}
		});
	}
	
	$("#form_order").find("#btn_addOrderDetail").click(function(e){
		var slotAddOrderDetail = $("#form_order").find("#orderDetail_Holder");
		
		var listItem;
		$.ajax({
			url: base_URL+"/api/deal/get",
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				
				var newRow = '<div class="row">'+
								'<div class="row">'+
									'<div class="input-field col m6">'+
										'<label>Select Item</label>'+ 
										'<select name="orderDetail_Item">'+
										'</select>'+
									'</div>'+
									'<div class="input-field col m3">'+
										'<div class="input-field">'+
											'<input name="item_Price" placeholder="Item Price" readonly="readonly" type="number">'+
										'</div>'+
									'</div>'+
									'<div class="input-field col m3">'+
										'<div class="input-field">'+
											'<input placeholder="amount" name="orderDetail_Amount" type="number">'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="row">'+
									'<div class="col m3 offset-m6">'+
										'<div class="input-field">'+
											'<h6 class="right">Cash:</h6>'+
										'</div>'+
									'</div>'+
									'<div class="input-field col m3">'+
										'<input placeholder="Cash" name="orderDetail_Cash" readonly="readonly" type="number">'+
										'<i class="fa fa-usd prefix"></i>'+
									'</div>'+
								'</div>'+
							'</div>';

				slotAddOrderDetail.append(newRow);

				for(var i =0;i < json.length; i++){
					slotAddOrderDetail.find("select[name=orderDetail_Item]").last().append('<option value="'+json[i].tbl_item.item_id+'" data-price="'+json[i].deal_price+'">'+json[i].tbl_item.item_name+'</option>');
				}
				
				$("select").material_select();
			}
		});
	});
	
	$(document).on("change", "#form_order #orderDetail_Holder select[name=orderDetail_Item]", function(e){
		var itemId = $(this).val();
		var thisDetail = $(this);
		
		$.ajax({
			url:base_URL+"/api/deal/select/"+itemId,
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				var inputPrice = thisDetail.closest(".row").find("input[name=item_Price]");
//				console.log(inputPrice);
//				console.log(json.deal_price);
				inputPrice.val(json.deal_price);
			}
		});
	});
	
	$(document).on("change", "#form_order #orderDetail_Holder input[name=orderDetail_Amount]", function(e){
		var itemPrice = $(this).closest(".row").find("input[name=item_Price]").val();
		
		var amount = $(this).val();
		
		var total = itemPrice * amount;
		$(this).closest(".row").next(".row").find("input[name=orderDetail_Cash]").val(total);
	});
	
	$(document).on("change", "input", function(){
		var listDetailTotal = $(document).find("input[name=orderDetail_Cash]");
		
		var total = 0;
		for(var i =0; i < listDetailTotal.length;i ++){
			total += Number(listDetailTotal[i].value);
		}
		
//		console.log(total);
		$(document).find("input#txt_orderTotal").val(0);
		$(document).find("input#txt_orderTotal").val(total);
		
		var inputTotal = $(document).find("input#txt_orderTotal");
		var inputReceive = $("input#txt_moneyReceived");
		var chance = Number(inputTotal.val()) - Number(inputReceive.val());
		
		$(document).find("input#txt_moneyChances").val(chance);
	});
});