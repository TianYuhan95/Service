package com.tian.front.mapper;

import com.tian.front.entity.User;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;

public interface UserMapper<T> {
    @Delete({
        "delete from tf_f_user",
        "where user_id = #{user_id,jdbcType=BIGINT}"
    })
    int deleteByPrimaryKey(Long user_id);

    @Insert({
        "insert into tf_f_user (user_id, login_name, ",
        "user_name, serial_number, ",
        "password, company_name, ",
        "create_date, end_date, ",
        "status, update_time)",
        "values (#{user_id,jdbcType=BIGINT}, #{login_name,jdbcType=VARCHAR}, ",
        "#{user_name,jdbcType=VARCHAR}, #{serial_number,jdbcType=VARCHAR}, ",
        "#{password,jdbcType=VARCHAR}, #{company_name,jdbcType=VARCHAR}, ",
        "#{create_date,jdbcType=TIMESTAMP}, #{end_date,jdbcType=TIMESTAMP}, ",
        "#{status,jdbcType=TINYINT}, #{update_time,jdbcType=TIMESTAMP})"
    })
    int insert(User record);

    @InsertProvider(type=UserSqlProvider.class, method="insertSelective")
    int insertSelective(User record);

    @Select({
        "select",
        "user_id, login_name, user_name, serial_number, password, company_name, create_date, ",
        "end_date, status, update_time",
        "from tf_f_user",
        "where user_id = #{user_id,jdbcType=BIGINT}"
    })
    @Results({
        @Result(column="user_id", property="user_id", jdbcType=JdbcType.BIGINT, id=true),
        @Result(column="login_name", property="login_name", jdbcType=JdbcType.VARCHAR),
        @Result(column="user_name", property="user_name", jdbcType=JdbcType.VARCHAR),
        @Result(column="serial_number", property="serial_number", jdbcType=JdbcType.VARCHAR),
        @Result(column="password", property="password", jdbcType=JdbcType.VARCHAR),
        @Result(column="company_name", property="company_name", jdbcType=JdbcType.VARCHAR),
        @Result(column="create_date", property="create_date", jdbcType=JdbcType.TIMESTAMP),
        @Result(column="end_date", property="end_date", jdbcType=JdbcType.TIMESTAMP),
        @Result(column="status", property="status", jdbcType=JdbcType.TINYINT),
        @Result(column="update_time", property="update_time", jdbcType=JdbcType.TIMESTAMP)
    })
    User selectByPrimaryKey(Long user_id);

    @UpdateProvider(type=UserSqlProvider.class, method="updateByPrimaryKeySelective")
    int updateByPrimaryKeySelective(User record);

    @Update({
        "update tf_f_user",
        "set login_name = #{login_name,jdbcType=VARCHAR},",
          "user_name = #{user_name,jdbcType=VARCHAR},",
          "serial_number = #{serial_number,jdbcType=VARCHAR},",
          "password = #{password,jdbcType=VARCHAR},",
          "company_name = #{company_name,jdbcType=VARCHAR},",
          "create_date = #{create_date,jdbcType=TIMESTAMP},",
          "end_date = #{end_date,jdbcType=TIMESTAMP},",
          "status = #{status,jdbcType=TINYINT},",
          "update_time = #{update_time,jdbcType=TIMESTAMP}",
        "where user_id = #{user_id,jdbcType=BIGINT}"
    })
    int updateByPrimaryKey(User record);

    @Select({
            "select",
            "login_name,user_name,serial_number,company_name,status,end_date",
            "from tf_f_user",
            "where login_name = #{login_name,jdbcType=VARCHAR}"
    })
    User findByLoginName(@Param("login_name") String login_name);

    @Select("select count(*) from tf_f_user where login_name=#{login_name}")
    int checkLoginName(@Param("login_name") String login_name);

    @Select("select login_name,password,status from tf_f_user where login_name=#{username,jdbcType=VARCHAR} and status!=3")
    User loginUse(String username);

    @Update("update tf_f_user set user_name=#{user_name},serial_number=#{serial_number} where login_name=#{login_name}")
    int updateByLoginName(String user_name,String serial_number,String login_name);
}