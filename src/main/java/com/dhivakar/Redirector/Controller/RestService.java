package com.dhivakar.Redirector.Controller;

import com.dhivakar.Redirector.Model.RandomStringGen;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestService {

    @RequestMapping("/")
    public String  HelloWorld(){
        return "Hello World";
    }

    @RequestMapping("/fetch/RandomString")
    public String StringGen(){
        RandomStringGen randomStringGen= new RandomStringGen();
            String reURL= randomStringGen.generaor();
            return reURL;
    }
}
