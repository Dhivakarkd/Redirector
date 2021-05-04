package com.dhivakar.Redirector.Model;

public class URLStore {
    private final int id;
    private final String url;
    private final String reurl;

    public URLStore(int id, String url, String reurl) {
        this.id = id;
        this.url = url;
        this.reurl = reurl;
    }
}
