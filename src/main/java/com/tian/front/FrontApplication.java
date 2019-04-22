package com.tian.front;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableAutoConfiguration
@EnableTransactionManagement
@MapperScan(basePackages = "com.tian.front.mapper")
public class FrontApplication {

    public static void main(String[] args) {
        SpringApplication.run(FrontApplication.class, args);
    }

}
