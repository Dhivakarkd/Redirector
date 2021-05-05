package com.dhivakar.Redirector.Dao;

import com.dhivakar.Redirector.Model.URLStore;
import com.dhivakar.Redirector.Repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DaoService {

    @Autowired
    UrlRepository repository;

    public URLStore getUrlbyShortLink(String link) {
        List<URLStore> list = repository.findByshorturl(link);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public boolean saveUrl(URLStore date){
        return repository.save(date) != null;
    }


}
