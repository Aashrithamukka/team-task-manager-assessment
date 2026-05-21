package com.aashritha.taskmanager.service;

import com.aashritha.taskmanager.dto.DashboardStats;
import com.aashritha.taskmanager.model.TaskItem;
import com.aashritha.taskmanager.model.TaskStatus;
import com.aashritha.taskmanager.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {
    private final TaskService taskService;

    public DashboardService(TaskService taskService) {
        this.taskService = taskService;
    }

    public DashboardStats statsFor(User currentUser) {
        List<TaskItem> tasks = taskService.listFor(currentUser);
        long todo = tasks.stream().filter(task -> task.getStatus() == TaskStatus.TODO).count();
        long inProgress = tasks.stream().filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS).count();
        long done = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        long overdue = tasks.stream()
                .filter(task -> task.getDueDate() != null)
                .filter(task -> task.getDueDate().isBefore(LocalDate.now()))
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .count();
        return new DashboardStats(tasks.size(), todo, inProgress, done, overdue);
    }
}
