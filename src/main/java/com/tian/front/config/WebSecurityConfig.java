package com.tian.front.config;

import com.tian.front.entity.User;
import com.tian.front.service.UserService;
import com.tian.front.utils.MyPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import javax.annotation.Resource;

/**
 * @BelongProject:security
 * @BelongPackage:com.tian.security.config
 * @Author:田宇寒
 * @CreateTime:2019-03-18
 * @Description:
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Resource
    private UserService<User> userService;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(new MyPasswordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //允许基于HttpServletRequest使用限制访问
        http.authorizeRequests()
                //不需要身份验证
                .antMatchers("/js/**","/css/**","/images/**","/fonts/**","/doc/**","/static/**","/bootstrap/**").permitAll()
                .antMatchers("/login.html","/login").permitAll()
                .antMatchers("/index","/","/index.html").permitAll()
                .antMatchers("/register/**","/register.html").permitAll()
                .antMatchers("/developer_center/**","/price_list/**","/onlineuse/**").permitAll()
                .antMatchers("/contact","/contact.html").permitAll()
                .anyRequest().authenticated()
                //自定义登陆界面
                .and().formLogin()
                .loginPage("/login").permitAll()
                .loginProcessingUrl("/login")
                .failureUrl("/login?error=1")
                .defaultSuccessUrl("/index").permitAll()
                .and().logout().logoutUrl("/logout").logoutSuccessUrl("/index")
                .and().headers().frameOptions().disable()
                .and().exceptionHandling().accessDeniedPage("/login")
                .and().httpBasic()
                .and().sessionManagement().invalidSessionUrl("/index")
//                .and().rememberMe()
                .and().csrf().disable();
    }

//    @Override
//    public void configure(WebSecurity web) throws Exception{
//        web.ignoring().antMatchers("/css/**","/js/**","/images/**","/developer_center/**");
//    }
}
