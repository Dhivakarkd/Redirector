package com.dhivakar.Redirector.Model;

public class URLStore {
    private int id;
    private String url;
    private String reurl;

    public URLStore(int id, String url, String reurl) {
        this.id = id;
        this.url = url;
        this.reurl = reurl;
    }
}
