package com.tian.front.utils;

import java.security.MessageDigest;

/**
 * @BelongProject:MD5
 * @BelongPackage:com.tian.utils
 * @Author:田宇寒
 * @CreateTime:2019-03-12
 * @Description:MD5加密工具类
 */
public class MD5 {
    private static final String[] digital = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"};

    private static StringBuilder initMD5(String password) throws Exception {
        //获取MD5算法核心类
        MessageDigest md5 = MessageDigest.getInstance("md5");
        //将明文经过md5加密后变为长度为16的字节数组--------->32位的字符串(16进制)
        byte[] bytes = md5.digest(password.getBytes("UTF-8"));
        StringBuilder miwen = new StringBuilder();
        for (byte b : bytes) {
            int temp = b;
            if (temp < 0) {
                temp += 256;
            }
            int index1 = temp / 16;
            int index2 = temp % 16;
            miwen.append(digital[index1]).append(digital[index2]);
        }
        return miwen;
    }

    public static String finalMD5(String password) throws Exception {
        return initMD5(
                initMD5(
                        initMD5(
                                initMD5(password)
                                        .append("tian").toString())
                                .append("yu").toString())
                        .append("han").toString()
        ).toString();
    }

    public static void main(String[] args) throws Exception {
        String miWen = MD5.finalMD5("654321");
        System.out.println(miWen);
    }
}
