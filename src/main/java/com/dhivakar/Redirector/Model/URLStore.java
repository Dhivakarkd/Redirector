package com.dhivakar.Redirector.Model;


import lombok.Data;

@Data
public class URLStore {
    private final int id;
    private final String url;
    private final String shorturl;

    public URLStore(int id, String url, String shorturl) {
        this.id = id;
        this.url = url;
        this.shorturl = shorturl;
    }
}
