package com.dhivakar.Redirector.Repository;

import com.dhivakar.Redirector.Model.URLStore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UrlRepository extends JpaRepository<URLStore, Integer> {

    List<URLStore> findByshorturl(String shorturl);

}
