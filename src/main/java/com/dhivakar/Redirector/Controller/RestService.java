package com.dhivakar.Redirector.Controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class RestService {

    @RequestMapping("/")
    public String  HelloWorld(){
        return "Hello World";
    }

    @RequestMapping("/get/{url}")
    public RedirectView Redirect(@PathVariable(name="url") String url)
    {
        RedirectView redirectView = new RedirectView();
        redirectView.setUrl("https://www."+url);
        return redirectView;
    }
}
