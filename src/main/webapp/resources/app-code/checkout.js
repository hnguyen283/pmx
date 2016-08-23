/**
 * 
 */

$("#form_order").submit(function(e) {
	e.preventDefault();
	var formData = $(this).serialize();

	var link = base_URL + "/api/order/create";

	$.ajax({
		url : link,
		data : formData,
		type : "POST",
		success : function(data) {
			var json = JSON.parse(data);
			console.log(json);
			if (json.result == "success") {				
				alertMessage(json.result + ": Success add order ID: "+ json.detail.order_id);
				$(".user-tool .div_cart #span_badgeSize").text(0);
				window.location = base_URL;
			} else {
				alertMessage(json.result + ": " + json.detail.order_id);
			}

		}
	});

	return false;
});