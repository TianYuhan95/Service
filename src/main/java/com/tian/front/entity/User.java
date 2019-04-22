package com.tian.front.entity;

import com.tian.front.utils.DateUtil;

import java.util.Date;

public class User {
    private Long user_id;

    private String login_name;

    private String user_name;

    private String serial_number;

    private String password;

    private String company_name;

    private Date create_date;

    private Date end_date;

    private Byte status;

    private Date update_time;

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getLogin_name() {
        return login_name;
    }

    public void setLogin_name(String login_name) {
        this.login_name = login_name == null ? null : login_name.trim();
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name == null ? null : user_name.trim();
    }

    public String getSerial_number() {
        return serial_number;
    }

    public void setSerial_number(String serial_number) {
        this.serial_number = serial_number == null ? null : serial_number.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name == null ? null : company_name.trim();
    }

    public Date getCreate_date() {
        return create_date;
    }

    public void setCreate_date(Date create_date) {
        this.create_date = create_date;
    }

    public String getEnd_date() {
        return DateUtil.getGMT(end_date);
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}