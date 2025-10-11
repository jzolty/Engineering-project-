package com.zolty.app.controller;

import com.zolty.app.model.Person;
import com.zolty.app.repository.PersonRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonController {

    @Autowired
    PersonRepo personRepo;

    @PostMapping("/addPerson")
    public void addPerson(@RequestBody Person person) {
        personRepo.save(person);
    }
}
