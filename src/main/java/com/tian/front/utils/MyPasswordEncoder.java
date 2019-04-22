package com.tian.front.utils;

public class MyPasswordEncoder implements org.springframework.security.crypto.password.PasswordEncoder {

    @Override
    public String encode(CharSequence charSequence) {
        try {
            return MD5.finalMD5(charSequence.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "wrong";
    }

    @Override
    public boolean matches(CharSequence charSequence, String s) {
        try {
            return s.equals(MD5.finalMD5(charSequence.toString()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
