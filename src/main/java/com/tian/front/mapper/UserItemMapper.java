package com.tian.front.mapper;

import com.tian.front.entity.UserItem;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.type.JdbcType;

public interface UserItemMapper {
    @Delete({
        "delete from tf_f_user_item",
        "where item_id = #{item_id,jdbcType=BIGINT}"
    })
    int deleteByPrimaryKey(Long item_id);

    @Insert({
        "insert into tf_f_user_item (item_id, user_id, ",
        "item_type, item_value, ",
        "item_remark)",
        "values (#{item_id,jdbcType=BIGINT}, #{user_id,jdbcType=BIGINT}, ",
        "#{item_type,jdbcType=TINYINT}, #{item_value,jdbcType=VARCHAR}, ",
        "#{item_remark,jdbcType=VARCHAR})"
    })
    int insert(UserItem record);

    @InsertProvider(type=UserItemSqlProvider.class, method="insertSelective")
    int insertSelective(UserItem record);

    @Select({
        "select",
        "item_id, user_id, item_type, item_value, item_remark",
        "from tf_f_user_item",
        "where item_id = #{item_id,jdbcType=BIGINT}"
    })
    @Results({
        @Result(column="item_id", property="item_id", jdbcType=JdbcType.BIGINT, id=true),
        @Result(column="user_id", property="user_id", jdbcType=JdbcType.BIGINT),
        @Result(column="item_type", property="item_type", jdbcType=JdbcType.TINYINT),
        @Result(column="item_value", property="item_value", jdbcType=JdbcType.VARCHAR),
        @Result(column="item_remark", property="item_remark", jdbcType=JdbcType.VARCHAR)
    })
    UserItem selectByPrimaryKey(Long item_id);

    @UpdateProvider(type=UserItemSqlProvider.class, method="updateByPrimaryKeySelective")
    int updateByPrimaryKeySelective(UserItem record);

    @Update({
        "update tf_f_user_item",
        "set user_id = #{user_id,jdbcType=BIGINT},",
          "item_type = #{item_type,jdbcType=TINYINT},",
          "item_value = #{item_value,jdbcType=VARCHAR},",
          "item_remark = #{item_remark,jdbcType=VARCHAR}",
        "where item_id = #{item_id,jdbcType=BIGINT}"
    })
    int updateByPrimaryKey(UserItem record);
}