package com.tian.front.utils;

import java.util.UUID;

public class AppKey {

    public static String createGuid() {
        UUID uuid = UUID.randomUUID();
        String key = uuid.toString();
        return key;
    }
    /**
     * 这是其中一个url的参数，是GUID的，全球唯一标志符
     * @return
     */
    public static String getGuid() {
        AppKey g = new AppKey();
        String guid = g.createGuid();
        return guid;
    }
    /**
     * 根据md5加密
     * @return
     */
    public static String getAppKey(String app_key) throws Exception {
        String app_sign = MD5.finalMD5(app_key).toUpperCase();// 得到以后还要用MD5加密。
        return app_sign;
    }

    public static void main(String[] args) throws Exception {
        AppKey gd = new AppKey();
        String app_key=gd.getGuid();
        System.out.println("guid: "+app_key);
        String app_screct=gd.getAppKey(app_key);
        System.out.println("app_key: "+app_screct);
    }
}
