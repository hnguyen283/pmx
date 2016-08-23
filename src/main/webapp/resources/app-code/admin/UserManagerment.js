/**
 * Nguyen Dong Hung
 */

window.onload = onLoadPage();

var sizePagination = 10;
var currentPageUser = 1;

function onLoadPage() {
	loadUser(0, 10);
	getPaginationItem(1, 10);
}

function getUsers(number_page) {
	if (number_page == 1) {
		loadUser(0, sizePagination);
		getPaginationItem(number_page, sizePagination);
	} else {
		loadUser(((number_page - 1) * sizePagination), sizePagination);
		getPaginationItem(number_page, sizePagination);
	}

}

function loadUser(start, size) {
	var userTable = $("#userTable");
	$.ajax({
		url : base_URL + "/api/user/getuserpaging",
		type : "POST",
		data : {
			"startid" : start,
			"sizepage" : size
		},
		success : function(data) {
			var json = JSON.parse(data);
			userTable.find("tbody").empty();
			if (json.length > 0) {
				for (var i = 0; i < json.length; i++) {
					addElementUserTable(json[i], i);
				}
			} else {
				console.log("no user data");
			}
		}
	});
}

function getPaginationItem(activePagination, sizePage) {
	$
			.ajax({
				url : base_URL + "/api/user/getNumberPage",
				type : "POST",
				typeData : 'json',
				data : ({
					"sizePagination" : sizePage
				}),
				success : function(data) {
					json = JSON.parse(data);
					if (json.deatail != "" || json.detail != undefined) {
						var pagination = $(".pagination");
						pagination.empty();
						if (activePagination == 1)
							pagination
									.append('<li class="disabled">'
											+ '<a id="chevron_left">'
											+ '<i class="material-icons">chevron_left</i>'
											+ '</a></li>');
						else
							pagination
									.append('<li class="waves-effect">'
											+ '<a id="chevron_left">'
											+ '<i class="material-icons">chevron_left</i>'
											+ '</a></li>');
						for (var i = 1; i <= json.detail; i++) {
							if (i == activePagination)
								pagination.append('<li class="active">'
										+ '<a id="element">' + i + '</a></li>');
							else
								pagination.append('<li class="waves-effect">'
										+ '<a id="element">' + i + '</a></li>');
						}
						if (json.detail == activePagination)
							pagination
									.append('<li class="disabled">'
											+ '<a id="chevron_right">'
											+ '<i class="material-icons">chevron_right</i>'
											+ '</a></li>');
						else
							pagination
									.append('<li class="waves-effect" id="li_chevron_right">'
											+ '<a id="chevron_right">'
											+ '<i class="material-icons">chevron_right</i>'
											+ '</a></li>');
						$(".pagination li #element").click(function() {
							var pageSelected = $(this).html();
							currentPageUser = pageSelected;
							console.log(currentPageUser);
							getUsers(pageSelected);
							getPaginationItem(pageSelected, sizePage);
						});
						$(".pagination #chevron_right")
								.click(
										function() {
											if (activePagination < json.detail) {
												getUsers(+activePagination + 1);
												getPaginationItem(
														+activePagination + 1,
														sizePage);
											}
										});
						$(".pagination #chevron_left").click(
								function() {
									if (activePagination > 1) {
										getUsers(activePagination - 1);
										getPaginationItem(activePagination - 1,
												sizePage);
									}
								});
					}
				}
			});
	return false;
}

function addElementUserTable(userAdd, indexRow) {

	var table = document.getElementById("tbody_user");
	var row = table.insertRow(indexRow);

	var checkbox_cell = row.insertCell(0);
	var user_id_cell = row.insertCell(1);
	var user_name_cell = row.insertCell(2);
	var user_address_cell = row.insertCell(3);
	var user_email_cell = row.insertCell(4);
	var user_phone_cell = row.insertCell(5);
	var user_email2_cell = row.insertCell(6);
	var user_phone2_cell = row.insertCell(7);
	var user_status_cell = row.insertCell(8);
	var role_name_cell = row.insertCell(9);
	var edit_bt_cell = row.insertCell(10);

	row.setAttribute("id", 'tr_' + userAdd.user_id);

	checkbox_cell.innerHTML = '<div class="input-field">' 
		+ '<input type="checkbox" id="' + userAdd.user_id + '" name="listUserId" value="' 
		+ userAdd.user_id
		+ '"> <label	for="' + userAdd.user_id
		+ '"></label> <label class="lb_id hide">' 
		+ userAdd.user_id
		+ '</label></div>';
	user_id_cell.innerHTML = userAdd.user_id;
	user_name_cell.innerHTML = userAdd.user_name;
	user_address_cell.innerHTML = userAdd.user_address;
	user_email_cell.innerHTML = userAdd.user_email;
	user_phone_cell.innerHTML = userAdd.user_phone;
	user_email2_cell.innerHTML = userAdd.user_email2;
	user_phone2_cell.innerHTML = userAdd.user_phone2;
	user_status_cell.innerHTML = userAdd.user_status;
	role_name_cell.innerHTML = userAdd.tbl_role.role_name;
	edit_bt_cell.innerHTML = '<button class="waves-effect waves-light btn bt_edit" style="width:130px" value="'
		+ userAdd.user_id
		+ '" >Edit <i class="material-icons left">settings</i></button>';

	if (table.rows.length >= 11) {
		table.deleteRow(10);
		getPaginationItem(1, sizePagination);
	}
}

$(document)
		.ready(
				function() {
					var listCheckBox;
					var btn_submit;
					var status_Addsubmit = false;

					$('#bt_addUser').click(function(e) {
						document.getElementById("addUserForm").reset();
						status_Addsubmit = true;
					});

					$('#bt_Delete').click(function(e) {
						e.preventDefault();
						$("#modalCommitDelete").openModal();
						return false;
					});

					$("#bt_submitDelete").click(function(e){
										e.preventDefault();
										var param = $("#form_tableUser").serialize();
										$.ajax({
											url : base_URL + "/api/user/delete",
											type : "POST",
											data : param,
											success : function(data){
												var json = JSON.parse(data);
														if (json.length > 0) {
															for (var i = 0; i < json.length; i++) {
																alertMessage("Success " + ": " + json[i]);
															}
														} else
															alertMessage("Error " + ": " + " Delete fail");
														getUsers(currentPageUser);
														}
										});
										return false;
										});

					$("#addUserForm").submit(
							function(e) {
								e.preventDefault();
								var link = base_URL + "/api/user/adduser";
								var message = "Add ";
								var page = 1;
								if (status_Addsubmit == false) {
									link = base_URL + "/api/user/update";
									message = "Update ";
									page = currentPageUser;
								}
								$.ajax({
									url : link,
									type : "post",
									data : $('#addUserForm').serialize()
								}).done(
										function(data) {
											var json = JSON.parse(data);
											console.log(json);
											alertMessage(message
													+ json.detail.user_name
													+ " : " + json.result);
											getUsers(page);
										});
								status_Addsubmit = false;
								$('#editUser').closeModal();
								return false;
							});

					$(document).on("click",".bt_edit",function(e){
										e.preventDefault();
										status_Addsubmit = false;
										$('#editUser').openModal();
										var btValue = $(this).val();
										var listTD = $('#tr_'+ btValue).find("td");
										var form_item = $("#addUserForm");
										if (listTD[0] != null) {
											var user_temp;
											var user_id_temp;
											console.log(listTD[1]);
											if (listTD[1]["innerText"] == null) {
												user_id_temp = listTD[1]["innerHTML"];
											} else {
												user_id_temp = listTD[1]["innerText"];
											}
											$.ajax({
												async : false,
												url : base_URL + "/api/user/getbyid",
												type : "post",
												data : {
													"user_id" : user_id_temp
													}
											}).done(function(data){
																var json = JSON.parse(data);
																$('#user_id').val(json.user_id);
																$('#user_name').val(json.user_name);
																$('#user_password').val(json.user_password);
																$('#user_address').val(json.user_address);
																$('#user_email').val(json.user_email);
																$('#user_phone').val(json.user_phone);
																$('#user_email2').val(json.user_email2);
																$('#user_phone2').val(json.user_phone2);

																removeSelectedSelector(0);
																removeSelectedSelector(1);

																setSelector(
																		json.user_status,
																		json.user_status,
																		1);
																setSelector(
																		json.tbl_role.role_name,
																		json.tbl_role.role_name,
																		0);
															});

										}

										$('select').material_select();
										return false;

									});
					function removeSelectedSelector(sectorIndex) {
						var form_item = $("#addUserForm");
						var selector = form_item.find("select")[sectorIndex];
						for (var i = 0; i < (selector.length); i++) {
							if (selector[i].selected) {
								var option = new Option(selector[i].text,
										selector[i].value, false, false);
								selector.add(option, i);
								selector.remove(i + 1);
							}
						}
					}

					function setSelector(option_text, option_value, sectorIndex) {
						var option = new Option(option_text, option_value,
								true, true);
						var form_item = $("#addUserForm");
						var selector = form_item.find("select")[sectorIndex];
						for (var i = 0; i < (selector.length); i++) {
							if ((selector[i].value) == option_value) {
								selector.add(option, selector[i]);
								selector.remove(i + 1);
							}
						}
					}
				});