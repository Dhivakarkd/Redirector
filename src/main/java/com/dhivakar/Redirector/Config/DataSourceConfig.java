package com.dhivakar.Redirector.Config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    private final String url ="jdbc:postgresql://ec2-23-22-191-232.compute-1.amazonaws.com:5432/df4meh5t5442kt";
            //System.getenv("DATASOURCE_URL");
    private final String username ="yyaqdzrwpsztco";
                    //System.getenv("DATASOURCE_USERNAME");
    private final String password ="7085deea7b2fd4d53ef9cb79cb5dcf624bf8b1e5569703a15fd1200f30bdd098";
                            //System.getenv("DATASOURCE_PASSWORD");

    @Bean
    public DataSource getDatasource() {
        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
        dataSourceBuilder.url(url);
        dataSourceBuilder.username(username);
        dataSourceBuilder.password(password);
        return dataSourceBuilder.build();
    }
}
