package com.aashritha.taskmanager.service;

import com.aashritha.taskmanager.dto.TaskRequest;
import com.aashritha.taskmanager.model.Project;
import com.aashritha.taskmanager.model.Role;
import com.aashritha.taskmanager.model.TaskItem;
import com.aashritha.taskmanager.model.TaskStatus;
import com.aashritha.taskmanager.model.User;
import com.aashritha.taskmanager.repository.TaskRepository;
import com.aashritha.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectService = projectService;
    }

    public TaskItem create(TaskRequest request, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new SecurityException("Only admins can create tasks");
        }

        Project project = projectService.getAccessibleProject(request.getProjectId(), currentUser);
        if (!project.getMemberIds().contains(request.getAssignedToId())) {
            throw new IllegalArgumentException("Assigned user must be a project member");
        }
        userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned user not found"));

        TaskItem task = new TaskItem();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProjectId(request.getProjectId());
        task.setAssignedToId(request.getAssignedToId());
        task.setCreatedById(currentUser.getId());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        return taskRepository.save(task);
    }

    public List<TaskItem> listFor(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return taskRepository.findAll();
        }
        return taskRepository.findByAssignedToId(currentUser.getId());
    }

    public TaskItem updateStatus(String taskId, TaskStatus status, User currentUser) {
        TaskItem task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (currentUser.getRole() != Role.ADMIN && !task.getAssignedToId().equals(currentUser.getId())) {
            throw new SecurityException("You can update only your assigned tasks");
        }
        task.setStatus(status);
        return taskRepository.save(task);
    }
}
