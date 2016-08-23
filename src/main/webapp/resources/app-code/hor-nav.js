/**
 * 
 */
function explanCollapsible(e) {
	var id = e.target.id
	console.log("class: " + $('#' + id).hasClass("active"));
	var temp = $('#' + id).addClass('collapsible-header active');
	console.log(temp[0]);
	$('.collapsible').collapsible({
		accordion : true
	});
}

function clearActive(e) {
	var collapsibleTemp = $(".collapsible")[0].children;
	console.log($(".collapsible")[0].children);
	console.log(collapsibleTemp);
	for (var i = 0; i < collapsibleTemp.length; i++) {
		console.log(collapsibleTemp[i].children[0].className);
		if (collapsibleTemp[i].children[0].className == 'collapsible-header active') {
			collapsibleTemp[i].children[0].className = 'collapsible-header';
		}
	}
	$('.collapsible').collapsible({
		accordion : true
	});
}

Element.prototype.findParentElement = function(tagName) {
    var self = this;    
    console.log(self);
    if(self.parentElement == null) return null; 
    if(self.parentElement.tagName == tagName.toUpperCase()) 
    	return self.parentElement;
    else return self.parentElement.findParentElement(tagName);    
};

$("#go_top_page").click(function() {
	window.scrollTo(0, 0);
});

$("#register").click(function(e){
	e.preventDefault();
	$("#modal_register").openModal();
});


$(document).ready(
				function(e) {
					$.ajax({
						url : base_URL + "/api/type/get",
						type : "GET",
						success : function(data) {
									var json = JSON.parse(data);
									var menuBar = $(document).find(".menu");
									for (var i = 0; i < json.length; i++) {
										var row = '<li>'
												+ '<div class="collapsible-header" id="collapsible_'
												+ json[i].type_id
												+ '" onmousemove="explanCollapsible(event)">'
												+ '<a href="'
												+ base_URL
												+ '/dealByType/type/'
												+ json[i].type_id
												+ '">'
												+ '<i class="'
												+ json[i].type_icon
												+ '"></i>'
												+ json[i].type_name
												+ '</a>'
												+ '</div>'
												+ '<div class="collapsible-body" onmouseout="clearActive(event)">'
												+ '<p>'
												+ json[i].type_description
												+ '</p>' + '</div>' + '</li>';
										menuBar.find("ul").append(row);
										}
									}
					});
					});