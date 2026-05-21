package com.aashritha.taskmanager.controller;

import com.aashritha.taskmanager.dto.UserSummary;
import com.aashritha.taskmanager.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserSummary> allUsers() {
        return userRepository.findAll().stream().map(UserSummary::new).toList();
    }
}
