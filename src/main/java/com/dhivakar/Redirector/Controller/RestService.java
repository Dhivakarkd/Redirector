package com.dhivakar.Redirector.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestService {

    @RequestMapping("/get")
    public String  HelloWorld(){
        return "Hello World";
    }
}
