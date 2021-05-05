package com.dhivakar.Redirector.Service;

import com.dhivakar.Redirector.Dao.DaoService;
import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Util.RandomStringGen;
import org.springframework.beans.factory.annotation.Autowired;

public class URLService {

    @Autowired
    private DaoService service;

    public URLStore urlhandler(String url) {
        return new URLStore(url, RandomStringGen.generaor());
    }


}
