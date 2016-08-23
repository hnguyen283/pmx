<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<!--Import Boostrap CSS-->
<link type="text/css" rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/bootstrap/bootstrap.min.css" />

<link type="text/css" rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/bootstrap/bootstrap-theme.min.css" />

<!--Let browser know website is optimized for mobile-->
<meta name="viewport" content="width=device-width, initial-scale=1.0" charset="UTF-8" />


<title>${title}</title>


<!--Import jQuery before materialize.js-->
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/jquery/jquery-3.1.0.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/bootstrap/bootstrap-3.3.7.js"></script>
<script type="text/javascript">	var base_URL = "<%=request.getContextPath()%>";</script>
<!--Import Boostrap JS-->

</head>
<body>