package com.aashritha.taskmanager.controller;

import com.aashritha.taskmanager.dto.TaskRequest;
import com.aashritha.taskmanager.dto.TaskStatusUpdateRequest;
import com.aashritha.taskmanager.model.TaskItem;
import com.aashritha.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController extends BaseController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public TaskItem create(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        return taskService.create(request, currentUser(authentication));
    }

    @GetMapping
    public List<TaskItem> list(Authentication authentication) {
        return taskService.listFor(currentUser(authentication));
    }

    @PatchMapping("/{taskId}/status")
    public TaskItem updateStatus(@PathVariable String taskId, @Valid @RequestBody TaskStatusUpdateRequest request,
                                 Authentication authentication) {
        return taskService.updateStatus(taskId, request.getStatus(), currentUser(authentication));
    }
}
