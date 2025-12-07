import Task from "./task.model.js";
import * as taskService from "./task.service.js";

export async function createTask(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = req.params.projectId;
        const result = await taskService.createTask(userId, projectId, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getTasks(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = req.params.projectId;
        const result = await taskService.getTasks(projectId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateTask(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        const result = await taskService.updateTask(projectId, taskId, userId, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteTask(req, res) {
    try {
        const userId = req.user.userId;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        const result = await taskService.deleteTask(projectId, taskId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

