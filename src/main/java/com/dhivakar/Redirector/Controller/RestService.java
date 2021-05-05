package com.dhivakar.Redirector.Controller;

import com.dhivakar.Redirector.Dao.DaoService;
import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Service.URLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;

@Controller
public class RestService {

    @Autowired
    DaoService service;


    @RequestMapping("/parse")
    public ResponseEntity<URLStore> StringGen(@RequestParam("url") String url,HttpServletResponse resp) {
        URLService urlService = new URLService();
        URLStore store= urlService.urlhandler(url);
        service.saveUrl(store);
        if(store.getShorturl() != null){
            return ResponseEntity.status(HttpStatus.CREATED).body(store);
        }else{
            try {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }
    }


    @RequestMapping(value = "/go",method = RequestMethod.GET)
    public ResponseEntity<Void> redirector(@RequestParam String url, HttpServletResponse resp) {
        System.out.println(url);
        URLStore urlstore = service.getUrlbyShortLink(url);
        if (urlstore == null) {
            try {
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        } else {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(urlstore.getUrl()))
                    .build();
        }
    }
}
