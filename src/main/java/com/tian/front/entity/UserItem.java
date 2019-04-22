package com.tian.front.entity;

public class UserItem {
    private Long item_id;

    private Long user_id;

    private Byte item_type;

    private String item_value;

    private String item_remark;

    public Long getItem_id() {
        return item_id;
    }

    public void setItem_id(Long item_id) {
        this.item_id = item_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Byte getItem_type() {
        return item_type;
    }

    public void setItem_type(Byte item_type) {
        this.item_type = item_type;
    }

    public String getItem_value() {
        return item_value;
    }

    public void setItem_value(String item_value) {
        this.item_value = item_value == null ? null : item_value.trim();
    }

    public String getItem_remark() {
        return item_remark;
    }

    public void setItem_remark(String item_remark) {
        this.item_remark = item_remark == null ? null : item_remark.trim();
    }
}