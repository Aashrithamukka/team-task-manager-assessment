package com.aashritha.taskmanager.dto;

import com.aashritha.taskmanager.model.Role;
import com.aashritha.taskmanager.model.User;

public class UserSummary {
    private String id;
    private String name;
    private String email;
    private Role role;

    public UserSummary(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}
