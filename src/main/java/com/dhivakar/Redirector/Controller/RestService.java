package com.dhivakar.Redirector.Controller;

import com.dhivakar.Redirector.Service.URLService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestService {


    @RequestMapping("/fetch/{url}")
    public void StringGen(@PathVariable("url") String url) {
        URLService urlService = new URLService();
        urlService.urlhandler(url);
    }

    @RequestMapping("/get")
    public String  HelloWorld(){
        return "Hello World";

    }
}
