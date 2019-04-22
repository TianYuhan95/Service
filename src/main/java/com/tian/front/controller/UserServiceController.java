package com.tian.front.controller;

import com.tian.front.entity.User;
import com.tian.front.service.IAuthenticationFacade;
import com.tian.front.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class UserServiceController {
    @Autowired
    UserService userService;
    @Autowired
    IAuthenticationFacade iAuthenticationFacade;

    @RequestMapping(value = "/user-center",method = RequestMethod.GET)
    public String getUserCenter(HttpServletRequest httpServletRequest){
        HttpSession httpSession = httpServletRequest.getSession();
        if (httpSession.getAttribute("userinfo")==null){
            User userinfo = userService.getUserInfoByLoginName(iAuthenticationFacade.getAuthentication().getName());
            if (userinfo!=null) {
                httpSession.setAttribute("userinfo",userinfo);
                return "user";
            }
            else
                return "index";
        }
        else
            return "user";
    }

    @RequestMapping(value = "/user-center/account/modify",method = RequestMethod.POST)
    @ResponseBody
    public boolean modifyAccount(@RequestParam("user_name") String user_name,@RequestParam("serial_number") String serial_number,HttpServletRequest httpServletRequest){
        HttpSession httpSession = httpServletRequest.getSession();
        User user = (User) httpSession.getAttribute("userinfo");
        if (userService.updateUserInfoByLoginName(user.getLogin_name(),user_name,serial_number)){
            user.setSerial_number(serial_number);
            user.setUser_name(user_name);
            httpSession.removeAttribute("userinfo");
            httpSession.setAttribute("userinfo",user);
            return true;
        }
        else
            return false;
    }

    @RequestMapping("/onlineuse/{option}")
    public String showPage(@PathVariable("option") String option){
        if (option.equals("voiceDictation"))
            return "voiceDictation";
        else if (option.equals("voiceOneSentence")){
            return "voiceOneSentence";
        }
        else if (option.equals("voiceToWords")){
            return "voiceToWords";
        }
        else return null;
    }
}
