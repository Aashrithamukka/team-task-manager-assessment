package com.aashritha.taskmanager.dto;

public class DashboardStats {
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long overdueTasks;

    public DashboardStats(long totalTasks, long todoTasks, long inProgressTasks, long completedTasks, long overdueTasks) {
        this.totalTasks = totalTasks;
        this.todoTasks = todoTasks;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
        this.overdueTasks = overdueTasks;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public long getTodoTasks() {
        return todoTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }
}
