package org.pmx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping("/home")
public class HomeController {
	@Autowired
	
	@RequestMapping(value = {"/", ""})
	public String index(ModelMap model){
		model.put("title", "Dashboard");
		return "home/index";
	}
	
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String loginPage(ModelMap model){
		model.put("title", "Login Administrator");
		return "admin/login";
	}
}