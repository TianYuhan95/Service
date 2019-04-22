package com.tian.front.service.impl;

import com.tian.front.entity.User;
import com.tian.front.mapper.UserMapper;
import com.tian.front.utils.MD5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

@Service
public class RegistServiceImpl implements com.tian.front.service.RegistService {
    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.DEFAULT,timeout=36000,rollbackFor=Exception.class)
    public boolean regist(String login_name, String company_name, String user_name, String serial_number, String password) throws Exception {
        String encode_password = MD5.finalMD5(password);
        Date date = new Date();
        int status = 0;
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE,5);
        User regist_user = new User();
        regist_user.setLogin_name(login_name);
        regist_user.setCompany_name(company_name);
        regist_user.setUser_name(user_name);
        regist_user.setSerial_number(serial_number);
        regist_user.setPassword(encode_password);
        regist_user.setEnd_date(calendar.getTime());
        regist_user.setStatus((byte)status);
        if(userMapper.insertSelective(regist_user)==1){
            return true;
        }
        else throw new IOException();
    }

    @Override
    public boolean checkLoginNameAvailable(String login_name){
        if(userMapper.checkLoginName(login_name)==0) return true;
        else return false;
    }
}
