package com.tian.front.controller;

import com.tian.front.service.RegistService;
import com.tian.front.utils.WebResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Validated
@Controller
public class RegistController {
    @Autowired
    private RegistService registService;

    @Autowired
    AuthenticationManager authenticationManager;

    @RequestMapping("/register/makeregist")
    @ResponseBody
    public WebResult makeRegist(@Size(min = 1,max = 10,message = "用户名不符合要求") @RequestParam("login_name") String login_name,
                                @Size(min = 1,max = 30,message = "请输入正确的公司名称") @RequestParam("company_name") String company_name,
                                @Size(min = 2,max = 10) @RequestParam("user_name") String user_name,
                                @Pattern(regexp = "^1(3|4|5|7|8)\\d{9}$",flags = {Pattern.Flag.CANON_EQ},message = "请输入正确的手机号") @RequestParam("serial_number") String serial_number,
                                @Size(min = 6,max = 16,message = "请输入6-16位密码") @RequestParam("password") String password,
                                HttpServletRequest httpServletRequest) throws Exception {
            if(registService.regist(login_name,company_name,user_name,serial_number,password)){

                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(login_name,password);
                token.setDetails(new WebAuthenticationDetails(httpServletRequest));
                Authentication authentication = authenticationManager.authenticate(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                httpServletRequest.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                        SecurityContextHolder.getContext());
                httpServletRequest.getSession().setAttribute("flag",1);
                return new WebResult(200,"success","");
            }
            else
                return new WebResult(500,"Internal Failer","");
    }

    @RequestMapping("/register/checkLoginName")
    @ResponseBody
    public boolean checkLoginName(@RequestParam("login_name") String login_name){
        return registService.checkLoginNameAvailable(login_name);
    }
}
