package com.dhivakar.Redirector;

import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Repository.UrlRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RedirectorApplication {

	public static void main(String[] args) {
		SpringApplication.run(RedirectorApplication.class, args);

	}
	@Bean
	public CommandLineRunner demo(UrlRepository repository) {
		return (args) -> {
			// save a few customers
			repository.save(new URLStore("https://www.youtube.com/", "nbDjao124a"));

		};
	}

}
