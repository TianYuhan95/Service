package com.tian.front.mapper;

import com.tian.front.entity.User;
import org.apache.ibatis.jdbc.SQL;

public class UserSqlProvider {

    public String insertSelective(User record) {
        SQL sql = new SQL();
        sql.INSERT_INTO("tf_f_user");
        
        if (record.getUser_id() != null) {
            sql.VALUES("user_id", "#{user_id,jdbcType=BIGINT}");
        }
        
        if (record.getLogin_name() != null) {
            sql.VALUES("login_name", "#{login_name,jdbcType=VARCHAR}");
        }
        
        if (record.getUser_name() != null) {
            sql.VALUES("user_name", "#{user_name,jdbcType=VARCHAR}");
        }
        
        if (record.getSerial_number() != null) {
            sql.VALUES("serial_number", "#{serial_number,jdbcType=VARCHAR}");
        }
        
        if (record.getPassword() != null) {
            sql.VALUES("password", "#{password,jdbcType=VARCHAR}");
        }
        
        if (record.getCompany_name() != null) {
            sql.VALUES("company_name", "#{company_name,jdbcType=VARCHAR}");
        }
        
        if (record.getCreate_date() != null) {
            sql.VALUES("create_date", "#{create_date,jdbcType=TIMESTAMP}");
        }
        
        if (record.getEnd_date() != null) {
            sql.VALUES("end_date", "#{end_date,jdbcType=TIMESTAMP}");
        }
        
        if (record.getStatus() != null) {
            sql.VALUES("status", "#{status,jdbcType=TINYINT}");
        }
        
        if (record.getUpdate_time() != null) {
            sql.VALUES("update_time", "#{update_time,jdbcType=TIMESTAMP}");
        }
        
        return sql.toString();
    }

    public String updateByPrimaryKeySelective(User record) {
        SQL sql = new SQL();
        sql.UPDATE("tf_f_user");
        
        if (record.getLogin_name() != null) {
            sql.SET("login_name = #{login_name,jdbcType=VARCHAR}");
        }
        
        if (record.getUser_name() != null) {
            sql.SET("user_name = #{user_name,jdbcType=VARCHAR}");
        }
        
        if (record.getSerial_number() != null) {
            sql.SET("serial_number = #{serial_number,jdbcType=VARCHAR}");
        }
        
        if (record.getPassword() != null) {
            sql.SET("password = #{password,jdbcType=VARCHAR}");
        }
        
        if (record.getCompany_name() != null) {
            sql.SET("company_name = #{company_name,jdbcType=VARCHAR}");
        }
        
        if (record.getCreate_date() != null) {
            sql.SET("create_date = #{create_date,jdbcType=TIMESTAMP}");
        }
        
        if (record.getEnd_date() != null) {
            sql.SET("end_date = #{end_date,jdbcType=TIMESTAMP}");
        }
        
        if (record.getStatus() != null) {
            sql.SET("status = #{status,jdbcType=TINYINT}");
        }
        
        if (record.getUpdate_time() != null) {
            sql.SET("update_time = #{update_time,jdbcType=TIMESTAMP}");
        }
        
        sql.WHERE("user_id = #{user_id,jdbcType=BIGINT}");
        
        return sql.toString();
    }
}