/**
**author : Nguyen Ngoc Hung
*
*
*
*/

$(document).ready(function(){
	
    var dealId = $(".btn_edit").val();
    var name_icon = 'star';
    
    $(window).load(function(){
    	$("#preloading").addClass("loaded");
    });
    
    $(document).ready(function(){
    	getImage();
    	getDeal();
    	getComment(dealId);
    	addRating();
    	$('.tooltipped').tooltip({delay: 50});
    });
    
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(pieChart);
    function pieChart() {
    	var status_vote = ["Chưa hài lòng (1 điểm)", 
        	              "Bình thường (2 điểm)", 
        	              "Khá ổn (3 điểm)", 
        	              "Rất tốt (4 điểm)", 
        	               "Tuyệt vời (5 điểm)"];
    	var result = [['Task', 'Number of each point']];
        $.ajax({
        	url : base_URL + "/api/rate/get",
        	typeData : 'json',
        	data : ({deal_id : dealId}), 
        	type : "POST",
        	success : function(data){
        		var json = JSON.parse(data);
        		if(json.result == "success"){
        			if(json.detail.length > 0){
        				var denominator = 0, element = 0;
	           			for(var i = 0; i < 5; i++){
	           				if(json.detail[i] != undefined){
	           					result.push([status_vote[json.detail[i][0] - 1], json.detail[i][1]]);
	           					element += json.detail[i][0] * json.detail[i][1];
	           					denominator += json.detail[i][1];
	           				}
	           			}
	           			var aver_point = Math.round(element / denominator);
	           			$("#lbl_point_rate").text("(Thống kê từ " + denominator + " người bình chọn)");
	           			showPointRating(aver_point);
	           			var data = google.visualization.arrayToDataTable(result);
	           			var options = {
	           					'title': 'Result vote point', 'width':460,
	                            'height':210
	           			};
	           			$("#piechart").empty();
	           			var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	           			chart.draw(data, options);
	           			$("#piechart").hide();
        			}else{
        				$("#piechart").hide();
        				showPointRating(0);
        				$("#lbl_point_rate").text("(Chưa ai bình chọn)");
        			}
        		}
        	}
        		
        });
    }
        
    function getImage(){
    	$.ajax({
    		url : base_URL + "/api/deal/getallimagebt",
    		type : "GET",
    		success : function(data){
    			var json = JSON.parse(data)
    			console.log(json);
    			if(json.length > 0){
    				for(var i = 0; i < json.length; i++){
    					if(json[i].deal_id == dealId){
    						for(var j = 0; j < json[i].number; j++){
    							if(json[i].image_witdh[j] <= (json[i].image_height[j] * 4) / 3){
	    							$('#image_item').append(
	    								 '<li>'
	    								+ '<img class="responsive-img" style="height:auto;" src="'
	    								+ base_URL
	    								+ '/resources/image/'
	    								+ dealId
	    								+ '/'
	    								+ json[i].image_name[j]
	    								+ '">'
	    								+ '</li>'
	    							
	    							);
    							}
    						}
    					}
    				}
    				$('.slider').slider({full_width: true});
    			}
    		}
    	})
    }
    
    function getDeal(){
    	$.ajax({
    		url : base_URL + "/api/deal/select/" + dealId,
    		type : "GET",
    		success : function(data){
    			var json = JSON.parse(data);
    			for(var key in json){
    				if(json.hasOwnProperty(key)){
    					if(json[key] != undefined && json[key] != ""){
    						if(key == "tbl_item"){
    							$("#item_name").text(json[key].item_name + " - " + json[key].item_owner);
    							$(".item_desciption").text(json[key].item_description);
    							$(".item_descibe").text(json[key].item_describe);
    						}
    						if(key == "deal_price"){
    							$(".value_reference").text(numeral(json[key]).format('0,0') + " đ");
    							$(".value_buy").text(numeral(parseInt(json[key] * json['deal_discount'])).format("0,0") + "đ");
    						}
    					}
    				}
    			}
    		}
    	})
    }
    
    function getComment(deal_id){
    	$.ajax({
    		url : base_URL + "/api/comment/get",
    		typeData : 'json',
			data : ({deal_id : deal_id}), 
    		type : "POST",
    		success : function(data){
    			var json = JSON.parse(data);
    			for(var key in json){
    				if(json.hasOwnProperty(key)){
    					if(json[key] != undefined && json[key] != "" && key == "detail"){
    						for(var i = 0; i < json[key].length; i++){
    							if(json[key][i].tbl_user.tbl_role.role_name == "ADMIN"){
	    							$("#comment_content_area").append(
	    								'<div class="card_panel indigo lighten-5">'
	    								+'<h5>'
	    								+ json[key][i].tbl_user.user_name
	    								+ '</h5>'
	    								+ '<h6>'
	    								+ json[key][i].comment_content
	    								+ '</h6>'
	    								+ '</div>'
	    							);
    							}else{
    								$("#comment_content_area").append(
    								'<h5>'
    								+ json[key][i].tbl_user.user_name
    								+ '</h5>'
    								+ '<h6>'
    								+ json[key][i].comment_content
    								+ '</h6>'
    								);
    							}
    						}
    					}
    				}
    			}
    		}
    	})
    }
    
    $("#comment_content").click(function(){
    	$.ajax({
    		url : base_URL 
				+ "/api/user/checkLogin",
			type :"POST",
			success : function(data){
				var json = JSON.parse(data);
				alertMessage("checkLogin : " + json.result);
				if(json.result == "fail"){
					document.getElementById("form_login_static").reset();
					$("#modal_login").openModal({dismissible:false});
				}
			}
    	});
    });
    
    $("#form_comment").submit(function(e){
    	e.preventDefault();
    	$.ajax({
    		url : base_URL 
				+ "/api/user/checkLogin",
			type :"POST",
			success : function(data){
				var json = JSON.parse(data);
				alertMessage("checkLogin : " + json.result);
				if(json.result == "fail"){
					document.getElementById("form_login_static").reset();
					$("#modal_login").openModal({dismissible:false});
				}
				else{
					if($("#comment_content").val() != ""){
						var formData = $("#form_comment").serialize() + '&deal_id=' + dealId;
						$.ajax({
				    		url : base_URL + "/api/comment/create",
				    		data : formData,
				    		type : "POST",
				    		success : function(data){
				    			var json = JSON.parse(data);
				    			alertMessage("insert comment" + ": " + json.detail);
				    			document.getElementById("form_comment").reset();
				    			$("#comment_content_area").empty();
				    			getComment(dealId);
				    		}
				    	});
					}
					else{
						$("#modal_login").closeModal();
					}
				}
			}
    	});
    });
    
    function addRating() {
		var obj = $(".rating");
				
		var toolti = ["1/5. Chưa hài lòng", "2/5. Bình thường", "3/5. Khá ổn", "4/5. Rất tốt", "5/5. Tuyệt vời"];
		
		// create the stars
		for(var i = 1 ; i <= 5 ; i++)
		{
			$('<a/>').addClass('tooltipped large material-icons')
				.attr("data-position", "top")
				.attr("data-delay", 50)
				.attr("data-tooltip", toolti[i - 1])
				.html($('<i/>')
						.addClass('large material-icons ')
						.attr("id", "vote_star")
						.html(name_icon + '_border')
						.data('rating', i)).appendTo(obj);
		}
		
		$(".rating").find('.material-icons').find("#vote_star").hover(
				function(e){
					showRating($(this).data('rating'));
				}, function(){
					showRating(0);
				}
			);
		
		$(".rating").find('.material-icons').find("#vote_star").click(function(){
			setRating($(this).data('rating'));
			var score = $(this).data('rating');
			var deal_id = $(".btn_edit").val();
			$.ajax({
				url : base_URL 
						+ "/api/user/checkLogin",
				type : "POST",
				success : function(data){
					var json = JSON.parse(data);
					alertMessage("checkLogin : " + json.result);
					if(json.result == "fail"){
						document.getElementById("form_login_static").reset();
						$("#modal_login").openModal({dismissible:false});
					}else{
						$.ajax({
							url : base_URL 
									+ "/api/rate/create",
							type : "POST",
							typeData : 'json',
							data : ({point : score, dealid : deal_id}),
							success : function(data){
								var json = JSON.parse(data);
								if(json.result == "success"){
									alertMessage("create" + ": " + json.detail);
									$(".rating").find('.material-icons').off();
									pieChart();
								}
							}
						});
					}
				}
			});
			
		});
		$(obj).append('<input type="hidden" name="rating" id="rating" />');
	};
    
	function setRating(numRating) {
		var obj = $(".rating");	
		$("#rating").val(numRating);
		showRating(numRating);
	};
	
	function showRating(numRating) {
		$(".rating").find('i').each(function(){
			var icon = name_icon + '_border';
			if($(this).data('rating') <= numRating)
				icon = name_icon;
			$(this).html(icon);
		})
	};
	
	function showPointRating(point){
		$(".point_rate").empty()
		for(var i = 1 ; i <= 5 ; i++)
		{
			if(i > point){
				$('<a/>').addClass('tooltipped')
					.attr("data-position", "top")
					.attr("data-delay", 50)
					.html($('<i/>')
							.addClass('material-icons ')
							.attr("id", "vote_star")
							.html("star_border")).appendTo($(".point_rate"));
			}else{
				$('<a/>').addClass('tooltipped')
					.attr("data-position", "top")
					.attr("data-delay", 50)
					.html($('<i/>')
							.addClass('material-icons ')
							.attr("id", "vote_star")
							.html("star")).appendTo($(".point_rate"));
			}
		}
		if(point > 0){
			$(".point_rate").find(".tooltipped").find("#vote_star").hover(function(){
				$("#piechart").show();
			}, function(){
				$("#piechart").hide();
			});
		}
		var left_pieChart = $(".point_rate").find(".tooltipped").find("#vote_star").offset().left + 100;
		var top_pieChart = $(".point_rate").find(".tooltipped").find("#vote_star").offset().top + 25;
		console.log(top_pieChart);
		$("#piechart").css({top: top_pieChart, left: left_pieChart, position:'absolute'});
	};
	
  });