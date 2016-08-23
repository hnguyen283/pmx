



$(document).ready(function(){
	
	var sizePagination = 5;
	
	var currentPage = 1;
	
	var ctx = document.getElementById("myChart");
	
	var myChart;
	
	
	
	$(document).ready(function(){
		loadItem(currentPage);
		getPaginationItem(currentPage)
		getDataDraw(1);
	});
	
	function drawChart(lablesIn, dataIn){
		myChart = new Chart(ctx, {
			    type: 'line',
			    data: {
			        labels: lablesIn,
			        datasets: [
			            {
			                label: "NUMBER OF DEAL BY TYPE",
			                fill: false,
			                lineTension: 0.1,
			                backgroundColor: "rgba(75,192,192,0.4)",
			                borderColor: "rgba(75,192,192,1)",
			                borderCapStyle: 'butt',
			                borderDash: [],
			                borderDashOffset: 0.0,
			                borderJoinStyle: 'miter',
			                pointBorderColor: "rgba(75,192,192,1)",
			                pointBackgroundColor: "#fff",
			                pointBorderWidth: 1,
			                pointHoverRadius: 10,
			                pointHoverBackgroundColor: "rgba(75,192,192,1)",
			                pointHoverBorderColor: "rgba(220,220,220,1)",
			                pointHoverBorderWidth: 2,
			                pointRadius: 1,
			                pointHitRadius: 10,
			                data: dataIn,
			            }
			        ]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        },
			        animation:{
			        	maintainAspectRatio:false
			        }
			    }
			});
	}
	
	function getDataDraw(type){
		var link = "topDealAmount";
		var lablesIn = [];
		var dataIn = [];
		switch(type){
			case 1:
				//Top deal amount
				link = "topDealAmount";
				break;
			case 2:
				//Deal Complete
				link = "dealComplete";
				break;
		}
		$.ajax({
			url : base_URL + "/api/deal/getdatachart",
			type : "POST",
			typeData : 'json',
			data : ({typeGet : link}), 
			success : function(data){
				var json = JSON.parse(data);
				if(json.detail != "" || json.detail != undefined){
					for(var i = 1; i<json.length;i++){
						lablesIn.push(json[i].result);
						dataIn.push(json[i].detail);
					}
					drawChart(lablesIn,dataIn);
				}				
			}
		})		
	}
	
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
				if(json.detail != "" || json.detail != undefined){
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
	};
	
	function loadItem(start){
		var table_item = $("#itemTable");
		$.ajax({
			async: false,
			url  : base_URL + "/api/product/getPagination",
			type : "GET",
			typeData : 'json',
			data : ({start : start, sizePagination : sizePagination}),
			success : function(data){
				var json = JSON.parse(data);
				table_item.find("tbody").empty();
				if(json.length > 0){
					for(var i = 0; i < json.length; i++){
						var row = '<tr>'
								+ '<td colspan="7"><h5 align="center">'
								+ json[i].item_id
								+ ' - ' 
								+ json[i].item_name
								+ '</h5></td>'
								+ '</tr>'
								+ '<tr>'
								+ '<td>Id</td>'
								+ '<td>Deal owner</td>'
								+ '<td>Deal begin</td>'
								+ '<td>Deal end</td>'
								+ '<td>Deal discount</td>'
								+ '<td>Deal amount</td>'
								+ '<td>Deal acceptable</td>'
								+ '</tr>';
						var item_id = json[i].item_id;
						$.ajax({
							async: false,
							url : base_URL + "/api/deal/getDealByItemId",
							type: "GET", 
							typeData : 'json',
							data : ({item_id : item_id}),
							success : function(data){
								var jsonDeal = JSON.parse(data);
								if(jsonDeal.detail.length > 0){
									console.log(jsonDeal.detail.length);
									var amount = 0;
									for(var i = 0; i < jsonDeal.detail.length; i++){
										row += '<tr>'
											+ '<td>'
											+ jsonDeal.detail[i].deal_id
											+ '</td>'
											
											+ '<td>'
											+ jsonDeal.detail[i].deal_owner
											+ '</td>'
											
											+ '<td>'
											+ jsonDeal.detail[i].deal_begin
											+ '</td>'
											
											+ '<td>'
											+ jsonDeal.detail[i].deal_end
											+ '</td>'
											
											+ '<td>'
											+ jsonDeal.detail[i].deal_discount
											+ '</td>'
											
											+ '<td>'
											+ jsonDeal.detail[i].deal_amount
											+ '</td>'
											
											+ '<td>'
											+ jsonDeal.detail[i].deal_acceptable
											+ '</td>'
											
											+ '</tr>';
										amount += jsonDeal.detail[i].deal_amount;
									}
									row += '<tr>'
										+ '<td colspan="5"><b>Amount</b></td></td>'
										+ '<td colspan="2">'
										+ amount
										+ '</td>'
										+ '</tr>'
									table_item.find("tbody").append(row);
								}else
									console.log("No data deal");
								
							}
						});
					}
				}
			}
		});
	};
	
});