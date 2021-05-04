package com.dhivakar.Redirector.Controller;

import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Util.RandomStringGen;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestService {

    @RequestMapping("/")
    public String  HelloWorld(){
        return "Hello World";
    }

    @RequestMapping("/fetch/{url}")
    public String StringGen(@PathVariable("url") String url){
        RandomStringGen randomStringGen= new RandomStringGen();
            String reURL= randomStringGen.generaor();
            int id=1;
        URLStore urlStore = new URLStore(id,url,reURL);
            id++;
            return reURL;
    }
}
