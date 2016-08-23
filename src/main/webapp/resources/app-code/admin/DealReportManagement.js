

/**
 * Hoang Nam .. Deal Management .
 * 
 */
$(document).ready(function() {

	var sizePagination = 10;
	
	var currentPage = 1;
	
	$(document).ready(function(){
		getDeal(currentPage);
		getPaginationDeal(currentPage);
	});
	
// -----------------------------------Deal Report ----------------------------------------------------
	
	$(document).on("click", "#btn_cancel", function(e) {
		e.preventDefault();
		
		var r = confirm("Do you want cancel that deal ");
		var  deal_id  = $(this).val();
		
		$.ajax({
			url : base_URL + "/api/deal/cancel/"+ $(this).val(),
			type : "GET",
			
			
				
			success : function(data) {
				if (r = true )
					{
				var json = JSON.parse(data);
				alertMessage(json.result+": "+json.detail);
				loadDeal(0);
					}
				else 
					loadDeal(0);
			}
			
		});

		return false;
	});
	
	$(document).on("click", "#btn_addtime" , function (e)
	{
		e.preventDefault();
		var modal_deal = $("#editdeal");
		var id = $(this).val();
		
		
		$.ajax({
			url: base_URL+"/api/deal/select/"+id,
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				var form_deal = $("#dealForm");
					modal_deal.find("#deal_id").val(json.deal_id);
					modal_deal.find("#txt_dealEnd").val(json.deal_end);
					modal_deal.find("#deal_status").val(json.deal_status);
					modal_deal.openModal();
			}
		});
		
		return false;
	});
	
	
	
	
	$("#dealForm").submit(function(e){
		
		e.preventDefault();
		var formData = $("#dealForm :input[name!=deal_id]").serialize();
		var dealId = $(this).find("input[name=deal_id]").val();
		
		alert(dealId);
		$.ajax({
			url : base_URL+ "/api/deal/active/"+dealId ,
			type : "POST",
			data : formData,
			success: function(data){
				var json = JSON.parse(data);
				$("#editdeal").closeModal();
				alertMessage(json.result+": "+json.detail);
				
				loadDeal(0);
			}
		});
		
		return false;
	});
	
	
	function reloadDeal()
	{
		var table_Deal = $("#form_deal");
		table_Deal.find("tbody").empty();
		$.ajax({
			url: base_URL+"/api/deal/get",
			type: "GET",
			success: function(data){
				var json = JSON.parse(data);
				
				for(var i=0;i<json.length;i++){
					
					var months = new Array(12);
					months["Jan"] = 0;
					months["Feb"] = 1;
					months["Mar"] = 2;
					months["Apr"] = 3 ;
					months["May"] = 4;
					months["Jun"] = 5;
					months["Jul"] = 6 ;
					months["Aug"] = 7;
					months["Sep"] = 8 ;
					months["Oct"] = 9 ;
					months["Nov"] = 10 ;
					months["Dec"] = 11 ;
					var utc = new Date();
					
					var day = json[i].deal_end.split(" ");
					var current_date = new Date(json[i].deal_end.substr(8,4),months[json[i].deal_end.substr(0,3)],json[i].deal_end.substr(4,2));
					var oneDay = 1000*3600*24;
					var diffDays = Math.round(Math.abs((current_date.getTime() - utc.getTime())/(oneDay)));
					
				
					if (json[i].deal_status.localeCompare("CANCEL") == 0)
						{
						var row = '<tr id="colorover">'			
							 +'<td>'+json[i].deal_id+'</td>'
							+'<td>'+json[i].deal_owner+'</td>'
							+'<td>'+json[i].deal_end+'</td>'
							+'<td>'+json[i].deal_discount+'</td>'
							+'<td>'+json[i].deal_amount+'</td>'
							+'<td>'+json[i].deal_acceptable+'</td>'
							+'<td>'+json[i].deal_description+'</td>'
							+'<td>'+json[i].deal_status+'</td>'
							+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
								+'</td>'
							
							+'</tr>'
						}
					else
					if (diffDays < 1 )
						var row = '<tr id="colorover">'			
						 +'<td>'+json[i].deal_id+'</td>'
						+'<td>'+json[i].deal_owner+'</td>'
						+'<td>'+json[i].deal_end+'</td>'
						+'<td>'+json[i].deal_discount+'</td>'
						+'<td>'+json[i].deal_amount+'</td>'
						+'<td>'+json[i].deal_acceptable+'</td>'
						+'<td>'+json[i].deal_description+'</td>'
						+'<td>'+json[i].deal_status+'</td>'
						+'<td><button class="waves-effect waves-light btn"'
						+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
							+'</td>'
							+'<td><button class="waves-effect waves-light btn"'
							+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
							+'</td>'
						
						+'</tr>'
						
						else if (diffDays == 1)
							{
							var row = '<tr id="coloremer">'			
								 +'<td>'+json[i].deal_id+'</td>'
								+'<td>'+json[i].deal_owner+'</td>'
								+'<td>'+json[i].deal_end+'</td>'
								+'<td>'+json[i].deal_discount+'</td>'
								+'<td>'+json[i].deal_amount+'</td>'
								+'<td>'+json[i].deal_acceptable+'</td>'
								+'<td>'+json[i].deal_description+'</td>'
								+'<td>'+json[i].deal_status+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
									+'<td><button class="waves-effect waves-light btn"'
									+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
									+'</td>'
								
								+'</tr>'
							}
					
					
						else if (diffDays >1 && diffDays <5)
							{
							var row = '<tr id="colordanger">'			
								 +'<td>'+json[i].deal_id+'</td>'
								+'<td>'+json[i].deal_owner+'</td>'
								+'<td>'+json[i].deal_end+'</td>'
								+'<td>'+json[i].deal_discount+'</td>'
								+'<td>'+json[i].deal_amount+'</td>'
								+'<td>'+json[i].deal_acceptable+'</td>'
								+'<td>'+json[i].deal_description+'</td>'
								+'<td>'+json[i].deal_status+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
									+'<td><button class="waves-effect waves-light btn"'
									+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
									+'</td>'
								
								+'</tr>'
							}
						else 
							{
							var row = '<tr>'			
								 +'<td>'+json[i].deal_id+'</td>'
								+'<td>'+json[i].deal_owner+'</td>'
								+'<td>'+json[i].deal_end+'</td>'
								+'<td>'+json[i].deal_discount+'</td>'
								+'<td>'+json[i].deal_amount+'</td>'
								+'<td>'+json[i].deal_acceptable+'</td>'
								+'<td>'+json[i].deal_description+'</td>'
								+'<td>'+json[i].deal_status+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
									+'<td><button class="waves-effect waves-light btn"'
									+'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
									+'</td>'
								+'</tr>'
							}
					
					table_Deal.find("tbody").append(row);

				}
			}
		});
	}
	
	function loadDeal(start){
		var table_Deal = $("#form_deal");
		table_Deal.find("tbody").empty();
		$.ajax({
			url: base_URL+"/api/deal/getPagination",
			type: "GET",
			typeData : 'json',
			data : ({start : start, sizePagination : sizePagination}),
			success: function(data){
				var json = JSON.parse(data);
				table_Deal.find("tbody").empty();
				for(var i=0;i<json.length;i++){
					var months = new Array(12);
					months["Jan"] = 0;
					months["Feb"] = 1;
					months["Mar"] = 2;
					months["Apr"] = 3 ;
					months["May"] = 4;
					months["Jun"] = 5;
					months["Jul"] = 6 ;
					months["Aug"] = 7;
					months["Sep"] = 8 ;
					months["Oct"] = 9 ;
					months["Nov"] = 10 ;
					months["Dec"] = 11 ;
					var utc = new Date();
					
					var day = json[i].deal_end.split(" ");
					var current_date = new Date(json[i].deal_end.substr(8,4),months[json[i].deal_end.substr(0,3)],json[i].deal_end.substr(4,2));
					var oneDay = 1000*3600*24;
					var diffDays = Math.round(Math.abs((current_date.getTime() - utc.getTime())/(oneDay)));
					
				
					if (json[i].deal_status.localeCompare("CANCEL") == 0)
						{
						var row = '<tr id="colorover">'			
							 +'<td>'+json[i].deal_id+'</td>'
							+'<td>'+json[i].deal_owner+'</td>'
							+'<td>'+json[i].deal_end+'</td>'
							+'<td>'+json[i].deal_discount+'</td>'
							+'<td>'+json[i].deal_amount+'</td>'
							+'<td>'+json[i].deal_acceptable+'</td>'
							+'<td>'+json[i].deal_description+'</td>'
							+'<td>'+json[i].deal_status+'</td>'
							+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
								+'</td>'
							
							+'</tr>'
						}
					else
					if (diffDays < 1 )
						var row = '<tr id="colorover">'			
						 +'<td>'+json[i].deal_id+'</td>'
						+'<td>'+json[i].deal_owner+'</td>'
						+'<td>'+json[i].deal_end+'</td>'
						+'<td>'+json[i].deal_discount+'</td>'
						+'<td>'+json[i].deal_amount+'</td>'
						+'<td>'+json[i].deal_acceptable+'</td>'
						+'<td>'+json[i].deal_description+'</td>'
						+'<td>'+json[i].deal_status+'</td>'
						+'<td><button class="waves-effect waves-light btn"'
						+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
							+'</td>'
							+'<td><button class="waves-effect waves-light btn"'
							+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
							+'</td>'
						
						+'</tr>'
						
						else if (diffDays == 1)
							{
							var row = '<tr id="coloremer">'			
								 +'<td>'+json[i].deal_id+'</td>'
								+'<td>'+json[i].deal_owner+'</td>'
								+'<td>'+json[i].deal_end+'</td>'
								+'<td>'+json[i].deal_discount+'</td>'
								+'<td>'+json[i].deal_amount+'</td>'
								+'<td>'+json[i].deal_acceptable+'</td>'
								+'<td>'+json[i].deal_description+'</td>'
								+'<td>'+json[i].deal_status+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
									+'<td><button class="waves-effect waves-light btn"'
									+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
									+'</td>'
								
								+'</tr>'
							}
					
					
						else if (diffDays >1 && diffDays <5)
							{
							var row = '<tr id="colordanger">'			
								 +'<td>'+json[i].deal_id+'</td>'
								+'<td>'+json[i].deal_owner+'</td>'
								+'<td>'+json[i].deal_end+'</td>'
								+'<td>'+json[i].deal_discount+'</td>'
								+'<td>'+json[i].deal_amount+'</td>'
								+'<td>'+json[i].deal_acceptable+'</td>'
								+'<td>'+json[i].deal_description+'</td>'
								+'<td>'+json[i].deal_status+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
									+'<td><button class="waves-effect waves-light btn"'
									+	'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
									+'</td>'
								
								+'</tr>'
							}
						else 
							{
							var row = '<tr>'			
								 +'<td>'+json[i].deal_id+'</td>'
								+'<td>'+json[i].deal_owner+'</td>'
								+'<td>'+json[i].deal_end+'</td>'
								+'<td>'+json[i].deal_discount+'</td>'
								+'<td>'+json[i].deal_amount+'</td>'
								+'<td>'+json[i].deal_acceptable+'</td>'
								+'<td>'+json[i].deal_description+'</td>'
								+'<td>'+json[i].deal_status+'</td>'
								+'<td><button class="waves-effect waves-light btn"'
								+'id="btn_addtime" value="'+json[i].deal_id+'">ACTIVE</button>'
									+'</td>'
									+'<td><button class="waves-effect waves-light btn"'
									+'id="btn_cancel" value="'+json[i].deal_id+'">Cancel</button>'
									+'</td>'
								+'</tr>'
							}
					
					table_Deal.find("tbody").append(row);
				}
			}
		});
	}
	
//	--------------------------------------- Deal management -----------------------------------------------
//	---------------------------------------------------------------------------------------------
	

	
	

	
	
	
	function getDeal(number_page){
		if(number_page == 1){
		
			loadDeal(0);
		}
		else{
		
			loadDeal((number_page - 1)* sizePagination);
		}
	}
	
	function getPaginationDeal(activePagination){
		$.ajax({
			url : base_URL + "/api/deal/getNumberPage",
			type : "GET",
			typeData : 'json',
			data : ({sizePagination : sizePagination}), 
			success : function(data){
				json = JSON.parse(data);
				console.log(json);
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
				    	getDeal(size);
				    	getPaginationDeal(size);
				    });
					$(".pagination #chevron_right").click(function(){
				    	if(activePagination < json.detail){
				    		currentPage = +activePagination + 1;
				    		getDeal(currentPage);
				    		getPaginationDeal(currentPage);
				    	}
				    });
					$(".pagination #chevron_left").click(function(){
				    	if(activePagination > 1){
				    		currentPage = activePagination - 1;
				    		getDeal(currentPage);
				    		getPaginationDeal(currentPage);
				    	}
				    });
				}
			}
		});
		return false;
	}
	
	
	
	
});