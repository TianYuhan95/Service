package com.tian.front.service;

import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public interface RegistService {
    @Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.DEFAULT,timeout=36000,rollbackFor=Exception.class)
    boolean regist(String login_name, String company_name, String user_name, String serial_number, String password) throws Exception;

    boolean checkLoginNameAvailable(String login_name);
}
