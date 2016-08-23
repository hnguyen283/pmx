/**
 * author: Nguyen Dong Hung
 * 
 * 
 */
var toggleSort = true;
var currenPoint = 0;
var getDealVariable;
var numberItemGet = 16;
var sizeOfDeal = 1;
function load() {
	$.a_jquery_function();
}
$(document)
		.ready(
				function() {

					var jsonDealsNew = null;
					var jsonDealsNearDead = null;

					$("#bt_changeSortNew").click(
							function(e) {
								$("#bodyNew").html('');
								if (toggleSort)
									toggleSort = false
								else
									toggleSort = true;
								$("#bodyNew").html('');
								if (sizeOfDeal < currenPoint)
									currenPoint = sizeOfDeal;
								$("#preloading").removeClass("loaded");
								getDeals(toggleSort, "getbybegintime",
										"#bodyNew", 0, currenPoint);
								$("#preloading").addClass("loaded");
							});

					$("#bt_changeSortNearDeadLine").click(
							function(e) {
								$("#bodyNearDeadline").html('');
								if (toggleSort)
									toggleSort = false
								else
									toggleSort = true;
								$("#bodyNearDeadline").html('');
								if (sizeOfDeal < currenPoint)
									currenPoint = sizeOfDeal;
								$("#preloading").removeClass("loaded");
								getDeals(toggleSort, "getbyendtime",
										"#bodyNearDeadline", 0, currenPoint);
								$("#preloading").addClass("loaded");
							});

					$("#tabIndexNew").click(function(e) {
						togglePage = true;
					});

					$("#tabIndexNearDeadline").click(function(e) {
						togglePage = true;
					});
					
					$(window).load(function(){
				    	$("#preloading").addClass("loaded");
				    });
					
					var myimage = document.getElementById("bodyNew");
					if (myimage.addEventListener) {
						// IE9, Chrome, Safari, Opera
						myimage.addEventListener("mousewheel", MouseWheelHandler, false);
						// Firefox
						myimage.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
					}
					// IE 6/7/8
					else myimage.attachEvent("onmousewheel", MouseWheelHandler);
					function MouseWheelHandler(e) {
						
						var e = window.event || e; // old IE support
						console.log(e.pageX, e.pageY, e.layerX, e.layerY);
						console.log($('#bodyNew').height());
						
						if(e.pageY >= $('#bodyNew').height() && currenPoint < sizeOfDeal){
							load();
						}

						return false;
					}
					

					$(document).ready(
							function() {
								$("#bodyNew").html('');
								getDeals(toggleSort, "getbybegintime",
										"#bodyNew", 0, numberItemGet);
								$("#bodyNearDeadline").html('');
								getDeals(toggleSort, "getbyendtime",
										"#bodyNearDeadline", 0, numberItemGet);
								$.ajax({
									async : false,
									url : base_URL + "/api/deal/getnumberdeal",
									type : "GET",
									success : function(data) {
										var json = JSON.parse(data);
										sizeOfDeal = json.detail;
									}
								})

							});

					$.a_jquery_function = function loadRuntime() {

						var tempPoint = currenPoint + numberItemGet;
						if (sizeOfDeal < currenPoint)
							currenPoint = sizeOfDeal;
						if (sizeOfDeal < tempPoint)
							tempPoint = sizeOfDeal;
						getDeals(toggleSort, "getbybegintime", "#bodyNew",
								tempPoint, numberItemGet)
						getDeals(toggleSort, "getbyendtime",
								"#bodyNearDeadline", tempPoint, numberItemGet);
						currenPoint = tempPoint;
					}

					function getDeals(toggle, linkDeal, temp, startPoint,
							numberget) {
						if (toggle) {
							$.ajax({
								async : false,
								url : base_URL + "/api/deal/" + linkDeal,
								type : "GET",
								cache : false,
								data : {
									"sort" : "ASC",
									"start" : startPoint,
									"numberget" : numberget,
									"status" : "ACTIVE"
								},
								success : function(data) {
									var DealsTemp = JSON.parse(data);
									var result;
									if (linkDeal == "getbybegintime") {
										result = processing(DealsTemp, true);
									} else {
										result = processing(DealsTemp, false);
									}
									$(temp).append(result);
									
								}
							})
						} else {
							// console.log(toggle + " / " + linkDeal + " / " +
							// temp + " / " + startPoint + " / " + numberget);
							$.ajax({
								async : false,
								url : base_URL + "/api/deal/" + linkDeal,
								type : "GET",
								cache : false,
								data : {
									"sort" : "DESC",
									"start" : startPoint,
									"numberget" : numberget,
									"status" : "ACTIVE"
								},
								success : function(data) {
									var DealsTemp = JSON.parse(data);
									var result;
									if (linkDeal == "getbybegintime") {
										result = processing(DealsTemp, true);
									} else {
										result = processing(DealsTemp, false);
									}
									
									$(temp).append(result);
								}
							})
						}

					}

					function processing(json, isPage1) {
						var htmlBody = '';
						var numberOfColums = 0;
						var cache = '';
						var cacheSize = 0;
						var rowHeader = '<div class="row card_row_item" >';
						var rowEnd = '</div>';
						if (json.length > 0) {
							for (var i = 0; i < json.length; i++) {

								if (numberOfColums == 0) {
									htmlBody = htmlBody + rowHeader;
								}

								var tempSize = 3;
								if (json[i].image_deal.image_witdh[0] > (json[i].image_deal.image_height[0] * 4) / 3) {
									tempSize = 6
								}
								var cardSizeClass = 'm6 l' + tempSize;
								if (cacheSize != 0
										&& (numberOfColums + tempSize + cacheSize) <= 12) {
									htmlBody = htmlBody + cache;
									cacheSize = 0;
									cache = '';
									numberOfColums = numberOfColums + cacheSize;
								}

								numberOfColums = numberOfColums + tempSize;

								var imagePanel = '<div class="card-image waves-effect waves-block waves-light"> <img class="activator responsive-img" src=" '
										+ base_URL
										+ '/resources/image/'
										+ json[i].deal_id
										+ '/'
										+ json[i].image_deal.image_name[0]
										+ '"> </div>';
								var percent = '-' + Math.ceil((json[i].deal_discount*100)) + '%';
								var price = 'Giá: ' + Math.ceil((json[i].deal_price)*(json[i].deal_discount)) + ' VNĐ';
								var dateLeft = 'Còn ' +  json[i].day_left + ' Ngày';
								var item = '<div class="col s12 '+ cardSizeClass + '"> <div class="card medium" id=card_' + json[i].deal_id + '> '
										+ '<div class="fixed-action-btn horizontal" style="position: absolute;top: 20px;right: 40px;bottom: 300px;"> <a class="btn-floating btn-large red">   <p class="center" style="margin-top: 0px;" >' + percent + '</p> </a><ul><li> <div class="card-panel" style="font-weight: bold;">	<span class="red-text">' + price + '</span> </div> </li></ul></div>'
										+ imagePanel
										+ ' <div class="card-content">'
										+ '<span class="card-title activator grey-text text-darken-4" style="font-size:20px;">'
										+ json[i].tbl_item.item_name
										+ '<i class="material-icons right">more_vert</i> </span>'
										+ '<p style="width: 110px;" ><a href="'
										+ base_URL
										+ '/dealDetail/deal/'
										+ json[i].deal_id
										+ '">Xem chi tiết</a></p>'
										+ '<span class="red-text">' + dateLeft + '</span>'
										+ '</div> <div class="card-reveal"> <span class="card-title grey-text text-darken-4">'
										+ json[i].tbl_item.item_name
										+ '<i	class="material-icons right">close</i></span>	<p>'
										+ json[i].deal_description
										+ '.</p>'
										+ ' <button class="btn_buy btn wave-light wave-effect green darken-3" value="'
										+ json[i].deal_id
										+ '">Thêm vào giỏ<i class="material-icons right">send</i> </button>'
										+ '	</div>	</div>	</div> ';

								if (numberOfColums <= 12) {
									htmlBody = htmlBody + item;
								} else {
									numberOfColums = numberOfColums - tempSize;
									cache = item;
									cacheSize = tempSize;
								}

								if (numberOfColums == 12) {
									htmlBody = htmlBody + rowEnd;
									numberOfColums = 0;
								}

								if (i == (json.length - 1) && cacheSize != 0
										&& numberOfColums <= 6) {
									htmlBody = htmlBody + rowEnd + rowHeader
											+ cache;
									cacheSize = 0;
									cache = '';
								}

							}
						} else
							console.log("no item data");
						return htmlBody;
					}
					
				});
