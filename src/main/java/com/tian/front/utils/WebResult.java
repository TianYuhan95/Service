package com.tian.front.utils;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author tianyuhan
 *
 */
public class WebResult<T>  {

    public static final Integer SUCCESS = 200;
    public static final Integer FAILED = 500;

    /**
     * 状态码
     */
    @JsonProperty("flag")
    private Integer flag;
    /**
     * 信息
     */
    @JsonProperty("info")
    private String info;

    /**
     * 数据
     */
    @JsonProperty("data")
    private T data;

    public WebResult() {
    }

    public WebResult(Integer flag) {
        this.flag = flag;
    }

    public WebResult(Integer flag, String info, T data) {
        this.flag = flag;
        this.info = info;
        this.data = data;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
