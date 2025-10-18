package com.zolty.app.controller;



import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/user")
    public String forUsers() {
        return "Dostęp przyznany: USER lub ADMIN ✅";
    }

    @GetMapping("/admin")
    public String forAdmins() {
        return "Dostęp przyznany: tylko ADMIN 👑";
    }
}
