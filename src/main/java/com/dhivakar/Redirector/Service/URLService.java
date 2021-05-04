package com.dhivakar.Redirector.Service;

import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Util.RandomStringGen;

public class URLService {

    public void urlhandler(String url)
    {
    RandomStringGen randomStringGen = new RandomStringGen();
    String reURL = randomStringGen.generaor();
    int id = 1;
    URLStore urlStore = new URLStore(id, url, reURL);
    id++;
    }
}
