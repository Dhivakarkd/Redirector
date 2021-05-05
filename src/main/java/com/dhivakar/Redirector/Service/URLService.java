package com.dhivakar.Redirector.Service;

import com.dhivakar.Redirector.Dao.DaoService;
import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Util.RandomStringGen;
import org.springframework.beans.factory.annotation.Autowired;

public class URLService {

    @Autowired
    private DaoService service;

    public void urlhandler(String url)
    {




    }
    private String saveUrl(String url){
        String shortval=RandomStringGen.generaor();
        URLStore data=new URLStore(url,shortval);
        if(service.saveUrl(data)) {
            return shortval;
        }else {
            return null;
        }
    }
}
