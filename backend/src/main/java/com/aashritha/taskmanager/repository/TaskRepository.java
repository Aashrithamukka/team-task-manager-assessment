package com.aashritha.taskmanager.repository;

import com.aashritha.taskmanager.model.TaskItem;
import com.aashritha.taskmanager.model.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends MongoRepository<TaskItem, String> {
    List<TaskItem> findByProjectIdIn(List<String> projectIds);

    List<TaskItem> findByAssignedToId(String assignedToId);

    long countByStatus(TaskStatus status);

    long countByDueDateBeforeAndStatusNot(LocalDate dueDate, TaskStatus status);
}
