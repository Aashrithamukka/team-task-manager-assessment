package com.aashritha.taskmanager.service;

import com.aashritha.taskmanager.dto.ProjectRequest;
import com.aashritha.taskmanager.model.Project;
import com.aashritha.taskmanager.model.Role;
import com.aashritha.taskmanager.model.User;
import com.aashritha.taskmanager.repository.ProjectRepository;
import com.aashritha.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project create(ProjectRequest request, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new SecurityException("Only admins can create projects");
        }

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwnerId(currentUser.getId());
        project.setMemberIds(request.getMemberIds());
        return projectRepository.save(project);
    }

    public List<Project> listFor(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return projectRepository.findAll();
        }
        return projectRepository.findByOwnerIdOrMemberIdsContaining(currentUser.getId(), currentUser.getId());
    }

    public Project getAccessibleProject(String projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (currentUser.getRole() == Role.ADMIN || project.getMemberIds().contains(currentUser.getId())
                || project.getOwnerId().equals(currentUser.getId())) {
            return project;
        }
        throw new SecurityException("You do not have access to this project");
    }

    public List<User> listMembers(String projectId, User currentUser) {
        Project project = getAccessibleProject(projectId, currentUser);
        return userRepository.findByIdIn(project.getMemberIds());
    }
}
