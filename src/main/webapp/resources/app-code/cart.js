/**
 * author: Nguyen Hong Nhut
 * modifier: Nguyen Dong Hung
 */

$(document).ready(function(e){
	$("#table_listItem").ready(function(){
		loadCart();
	});
	
	$(document).on("click", ".btn_buy", function(e){
		e.preventDefault();
		var dealId = $(this).val();		
		$.ajax({
			url: base_URL+"/api/cart/add",
			type: "POST",
			data: "dealId="+dealId+"&amount=1",
			success: function(data){
				var json = JSON.parse(data);
				var temp = $(".user-tool .div_cart #span_badgeSize").text();
				$(".user-tool .div_cart #span_badgeSize").text(++temp);
//				console.log(temp);
				alertMessage(json.result+": "+json.detail);
			}
		});
		
		return false;
	});
	
	$(document).on("click", ".btn_cancelDeal", function(e){
		e.preventDefault();
		
		var dealId = $(this).val();
		var row = e.currentTarget.findParentElement('tr');
		document.getElementById("table_listItem").deleteRow(row.rowIndex);
		$.ajax({
			url: base_URL+"/api/cart/delete/"+dealId,
			type: "POST",
			success: function(data){
				var json = JSON.parse(data);
				
				alertMessage(json.result+": "+json.detail);
			}
		});
		
		return false;
	});
	
	$("#form_cart").submit(function(e){
		e.preventDefault();
		
		var formData = $(this).serialize();
		
		$.ajax({
			url: base_URL+"/api/cart/update",
			data: formData,
			type: "POST",
			success: function(data){
				var json = JSON.parse(data);
				
				if(json.result == "success"){
					$(".user-tool .div_cart #span_badgeSize").text(0);
					window.location = base_URL+"/checkout";
				}else{
					alertMessage(json.result+": "+json.detail);
				}
			}
		});
		
		return false;
	});
	
	$("#btn_save").click(function(e){
		e.preventDefault();
		
		var formData = $("#form_cart").serialize();
		
		$.ajax({
			url: base_URL+"/api/cart/update",
			data: formData,
			type: "POST",
			success: function(data){
				var json = JSON.parse(data);
				
				alertMessage(json.result+": "+json.detail);
				if(json.result == "success"){
					loadCart();
				}
			}
		});
		
		return false;
	});
	
	
	$("#form_cart").find("#btn_clear").click(function(e){
		e.preventDefault();
		
		if(confirm("you will take responsibility for this?")){
			$.ajax({
				url: base_URL+"/api/cart/clear",
				type: "GET",
				success: function(data){
					var json = JSON.parse(data);
					
					alertMessage(json.result+": "+json.detail);
					
					if(json.result == "success"){
						loadCart();
					}
				}
			});
		}
		return false;
	});
	
	$(document).on("change", "#table_listItem tbody input[name=amounts]", function(e){
		
		var amount = $(this).val();
		if(amount > 0){
			var deal_price = $(this).closest("tr").find("td[name=deal_price]")[0].childNodes[0].nodeValue;
			
			$(this).closest("tr").find("td[name=deal_total]")[0].childNodes[0].nodeValue = Number(deal_price) * amount;
		}else{
			alertMessage("amount must be larger than 0(zero)");
		}
	});
	
	function loadCart(){
		var tableCart = $("#table_listItem");
		tableCart.find("tbody").empty();
		$.ajax({
			url: base_URL+"/api/cart/get",
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				
				if(json.result == "success"){
					for(var i = 0;i < json.detail.length; i++){
						var row = '<tr>'+
									'<td>'+ i+'</td>'+
									'<td>'+
										'<input name="deals" type="number" value="'+json.detail[i].deal.deal_id+'" hidden="hidden" readonly="readonly">'+
										json.detail[i].deal.tbl_item.item_name+
									'</td>'+
									'<td>'+
										'<input type="number" value="'+json.detail[i].amount+'" name="amounts">'+
									'</td>'+
									'<td name="deal_price">'+
										json.detail[i].deal.deal_price+
									'</td>'+
									'<td name="deal_total">'+
										Number(json.detail[i].amount) * Number(json.detail[i].deal.deal_price)+
									'</td>'+
									'<th>'+
										'<button class="btn wave-effect wave-light red '+ 
										'btn_cancelDeal" value="'+json.detail[i].deal.deal_id+'">'+
										'<i class="fa fa-minus-circle"></i>'+
										'</button>'+
									'</th>'+
								'</tr>';
						
						tableCart.find("tbody").append(row);
					}
				}else {
					tableCart.find("tbody").append("<tr><td colspan='6'>"+json.detail+"</td></tr>");
				}
			}
		});
	}
	
	$(".user-tool #dropDownCart a").click(function(e){
		e.preventDefault();
		
		var link = $(this).attr("href");
		
		if(link != "#!"){
			$.ajax({
				url: link,
				type: "GET",
				success: function(data){
					var json = JSON.parse(data);
					
					alertMessage(json.result+": "+json.detail);
				}
			});
		}
		
		return false;
	});
	
	$.ajax({
		url: base_URL+"/api/cart/detail",
		type: "GET",
		success: function(data){
			
			var json = JSON.parse(data);
			
			if(json.result == "success"){
				var cartSize = $(".user-tool .div_cart #span_cartSize");
				var cartTotal = $(".user-tool .div_cart #span_cartTotal");
				
				cartSize.text(json.detail.members.items.value);
				$(".user-tool .div_cart #span_badgeSize").text(json.detail.members.items.value);
				cartTotal.text(json.detail.members.total.value);
			}else {
				$(".user-tool .div_cart #span_badgeSize").text("0");
			}
		}
	});
});