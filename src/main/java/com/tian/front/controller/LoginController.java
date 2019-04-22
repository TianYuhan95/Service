package com.tian.front.controller;

import com.tian.front.config.CompanyConfig;
import com.tian.front.mapper.UserMapper;
import com.tian.front.service.IAuthenticationFacade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    UserMapper userMapper;
    @Autowired
    IAuthenticationFacade iAuthenticationFacade;
    @Autowired
    CompanyConfig companyConfig;

    private static Logger logger = LoggerFactory.getLogger(LoginController.class);

    @RequestMapping(value = {"/login"},method = RequestMethod.GET)
    public String loginError(@RequestParam(value = "error",defaultValue = "0") Integer info, Model model){
        model.addAttribute("error",info);
        return "login";
    }


    @RequestMapping(value = {"/index","/"},method = RequestMethod.GET)
    public String getIndexHTML(HttpServletRequest httpServletRequest){
        HttpSession httpSession = httpServletRequest.getSession(true);
        if(iAuthenticationFacade.getAuthentication().getName()!="anonymousUser") {
                httpSession.setAttribute("flag",1);
                httpSession.setAttribute("userinfo",userMapper.findByLoginName(iAuthenticationFacade.getAuthentication().getName()));
        }
        else {
            if (httpSession.getAttribute("company_email")==null){
                httpSession.setAttribute("company_serial_number",companyConfig.getSerial_number());
                httpSession.setAttribute("company_email",companyConfig.getEmail());
            }
            httpSession.setAttribute("flag",0);
        }
        return "index";
    }

    @RequestMapping(value = "/register")
    public String getRegisterHTML(){
        return "register";
    }
}
