package com.dhivakar.Redirector.Model;

import java.util.Random;

public class RandomStringGen {
    public String generaor()
    {
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz1234567890";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for(int i = 0; i < 10; i++) {
            int index = random.nextInt(alphabet.length());
            char randomChar = alphabet.charAt(index);
            sb.append(randomChar);
        }
        return sb.toString();
    }
}
