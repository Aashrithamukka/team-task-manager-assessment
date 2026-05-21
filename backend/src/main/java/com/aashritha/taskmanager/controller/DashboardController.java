package com.aashritha.taskmanager.controller;

import com.aashritha.taskmanager.dto.DashboardStats;
import com.aashritha.taskmanager.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController extends BaseController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardStats stats(Authentication authentication) {
        return dashboardService.statsFor(currentUser(authentication));
    }
}
