package com.dhivakar.Redirector.Config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    private final String url =System.getenv("DATA_URL");
    private final String username =System.getenv("DATA_USERNAME");
    private final String password =System.getenv("DATA_PASSWORD");

    @Bean
    public DataSource getDatasource() {
        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
        dataSourceBuilder.url(url);
        dataSourceBuilder.username(username);
        dataSourceBuilder.password(password);
        return dataSourceBuilder.build();
    }
}
