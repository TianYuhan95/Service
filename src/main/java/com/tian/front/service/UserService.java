package com.tian.front.service;

import com.tian.front.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * @BelongProject:security
 * @BelongPackage:com.tian.security.service
 * @Author:田宇寒
 * @CreateTime:2019-03-18
 * @Description:
 */
public interface UserService<T> extends UserDetailsService {

    public User getUserInfoByLoginName(String login_name);

    public boolean updateUserInfoByLoginName(String login_name,String user_name,String serial_number);
}
