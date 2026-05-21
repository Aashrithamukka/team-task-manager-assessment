package com.aashritha.taskmanager.controller;

import com.aashritha.taskmanager.model.User;
import com.aashritha.taskmanager.security.UserPrincipal;
import org.springframework.security.core.Authentication;

public abstract class BaseController {
    protected User currentUser(Authentication authentication) {
        return ((UserPrincipal) authentication.getPrincipal()).getUser();
    }
}
