package com.tian.front.mapper;

import com.tian.front.entity.UserItem;
import org.apache.ibatis.jdbc.SQL;

public class UserItemSqlProvider {

    public String insertSelective(UserItem record) {
        SQL sql = new SQL();
        sql.INSERT_INTO("tf_f_user_item");
        
        if (record.getItem_id() != null) {
            sql.VALUES("item_id", "#{item_id,jdbcType=BIGINT}");
        }
        
        if (record.getUser_id() != null) {
            sql.VALUES("user_id", "#{user_id,jdbcType=BIGINT}");
        }
        
        if (record.getItem_type() != null) {
            sql.VALUES("item_type", "#{item_type,jdbcType=TINYINT}");
        }
        
        if (record.getItem_value() != null) {
            sql.VALUES("item_value", "#{item_value,jdbcType=VARCHAR}");
        }
        
        if (record.getItem_remark() != null) {
            sql.VALUES("item_remark", "#{item_remark,jdbcType=VARCHAR}");
        }
        
        return sql.toString();
    }

    public String updateByPrimaryKeySelective(UserItem record) {
        SQL sql = new SQL();
        sql.UPDATE("tf_f_user_item");
        
        if (record.getUser_id() != null) {
            sql.SET("user_id = #{user_id,jdbcType=BIGINT}");
        }
        
        if (record.getItem_type() != null) {
            sql.SET("item_type = #{item_type,jdbcType=TINYINT}");
        }
        
        if (record.getItem_value() != null) {
            sql.SET("item_value = #{item_value,jdbcType=VARCHAR}");
        }
        
        if (record.getItem_remark() != null) {
            sql.SET("item_remark = #{item_remark,jdbcType=VARCHAR}");
        }
        
        sql.WHERE("item_id = #{item_id,jdbcType=BIGINT}");
        
        return sql.toString();
    }
}