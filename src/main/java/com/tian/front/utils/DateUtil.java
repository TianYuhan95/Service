package com.tian.front.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class DateUtil {
    public static String getGMT(Date dateCST) {
        DateFormat df = new SimpleDateFormat("yyyy/M/d HH:mm:ss",Locale.US);
        df.setTimeZone(TimeZone.getTimeZone("GMT+8")); // modify Time Zone.
        return(df.format(dateCST));
    }

    public static Date getGMT(String dateGMT) throws ParseException {
        DateFormat df = new SimpleDateFormat("yyyy/M/d HH:mm:ss",Locale.US);
        return df.parse(dateGMT);
    }

    public static String getGMT(Timestamp dateGMT){
        DateFormat df = new SimpleDateFormat("yyyy/M/d HH:mm:ss",Locale.US);
        return df.format(dateGMT);
    }
}
