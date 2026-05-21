package com.aashritha.taskmanager.controller;

import com.aashritha.taskmanager.dto.ProjectRequest;
import com.aashritha.taskmanager.dto.UserSummary;
import com.aashritha.taskmanager.model.Project;
import com.aashritha.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController extends BaseController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public Project create(@Valid @RequestBody ProjectRequest request, Authentication authentication) {
        return projectService.create(request, currentUser(authentication));
    }

    @GetMapping
    public List<Project> list(Authentication authentication) {
        return projectService.listFor(currentUser(authentication));
    }

    @GetMapping("/{projectId}/members")
    public List<UserSummary> members(@PathVariable String projectId, Authentication authentication) {
        return projectService.listMembers(projectId, currentUser(authentication)).stream().map(UserSummary::new).toList();
    }
}
