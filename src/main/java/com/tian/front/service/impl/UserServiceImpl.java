package com.tian.front.service.impl;

import com.tian.front.entity.User;
import com.tian.front.mapper.UserMapper;
import com.tian.front.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * @BelongProject:security
 * @BelongPackage:com.tian.security.service.impl
 * @Author:田宇寒
 * @CreateTime:2019-03-18
 * @Description:
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserMapper<User> userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
                User user = userMapper.loginUse(username);
                if(null == user){
                    throw new UsernameNotFoundException("用户不存在");
                }
            //用户权限
                List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
                if(StringUtils.isNotBlank(user.getLogin_name())){
                    String role;
                    if(user.getStatus()==0) role="ROLE_TOUR";
                    else if(user.getStatus()==1) role="ROLE_REGISTED";
                    else role="ROLE_GRANTED";
                    if(StringUtils.isNotBlank(role)){
                        authorityList.add(new SimpleGrantedAuthority(role.trim()));
                    }
                }
            return new org.springframework.security.core.userdetails.User(user.getLogin_name(),user.getPassword(),
                    authorityList);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public User getUserInfoByLoginName(String login_name) {
        try {
            User user = userMapper.findByLoginName(login_name);
            if(null == user){
                throw new UsernameNotFoundException("用户不存在");
            }
            return user;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public boolean updateUserInfoByLoginName(String login_name, String user_name, String serial_number) {
        if (userMapper.updateByLoginName(user_name,serial_number,login_name)==1)
            return true;
        return false;
    }
}
