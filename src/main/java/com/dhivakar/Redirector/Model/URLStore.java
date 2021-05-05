package com.dhivakar.Redirector.Model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class URLStore {
    private  String url;
    private  String shorturl;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    public URLStore() {
    }

    public URLStore(String url, String shorturl) {
        this.url = url;
        this.shorturl = shorturl;
    }

    public URLStore(int id, String url, String shorturl) {
        this.id = id;
        this.url = url;
        this.shorturl = shorturl;
    }

}
