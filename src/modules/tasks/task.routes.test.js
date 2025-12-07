import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import taskRoutes from './task.routes.js';
import * as taskService from './task.service.js';

// Mock the task service
jest.mock('./task.service.js');

// Mock auth middleware
jest.mock('../auth/auth.middleware.js', () => ({
    authMiddleware: (req, _res, next) => {
        req.user = { userId: 'test-user-123' };
        next();
    },
}));

// Create test app
const app = express();
app.use(express.json());
app.use('/', taskRoutes);

describe('Task Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /:projectId/tasks', () => {
        it('should create a task and return 201', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'TODO',
                priority: 'HIGH',
            };

            const mockResponse = {
                message: 'Task created successfully',
                task: {
                    id: 'task-123',
                    ...taskData,
                    projectId: 'project-123',
                    createdBy: 'test-user-123',
                    createdAt: new Date(),
                },
            };

            taskService.createTask.mockResolvedValueOnce(mockResponse);

            const response = await request(app)
                .post('/project-123/tasks')
                .send(taskData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Task created successfully');
            expect(response.body.task.title).toBe('Test Task');
            expect(taskService.createTask).toHaveBeenCalledWith(
                'test-user-123',
                'project-123',
                taskData
            );
        });

        it('should return 400 on validation error', async () => {
            taskService.createTask.mockRejectedValueOnce(new Error('Task title is required'));

            const response = await request(app)
                .post('/project-123/tasks')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task title is required');
        });

        it('should return 400 when user lacks permission', async () => {
            taskService.createTask.mockRejectedValueOnce(
                new Error('You do not have permission to create tasks in this workspace')
            );

            const response = await request(app)
                .post('/project-123/tasks')
                .send({ title: 'Test' });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('permission');
        });
    });

    describe('GET /:projectId/tasks', () => {
        it('should get all tasks and return 200', async () => {
            const mockTasks = {
                tasks: [
                    {
                        id: 'task-1',
                        title: 'Task 1',
                        status: 'TODO',
                        priority: 'HIGH',
                        projectId: 'project-123',
                    },
                    {
                        id: 'task-2',
                        title: 'Task 2',
                        status: 'IN_PROGRESS',
                        priority: 'MEDIUM',
                        projectId: 'project-123',
                    },
                ],
            };

            taskService.getTasks.mockResolvedValueOnce(mockTasks);

            const response = await request(app).get('/project-123/tasks');

            expect(response.status).toBe(200);
            expect(response.body.tasks).toHaveLength(2);
            expect(response.body.tasks[0].title).toBe('Task 1');
            expect(taskService.getTasks).toHaveBeenCalledWith('project-123', 'test-user-123');
        });

        it('should return 400 when user lacks permission', async () => {
            taskService.getTasks.mockRejectedValueOnce(
                new Error('You do not have permission to view tasks in this workspace')
            );

            const response = await request(app).get('/project-123/tasks');

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('permission');
        });

        it('should return 400 when project not found', async () => {
            taskService.getTasks.mockRejectedValueOnce(
                new Error('Project not found in this workspace')
            );

            const response = await request(app).get('/invalid-project/tasks');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Project not found in this workspace');
        });
    });

    describe('PUT /:projectId/tasks/:taskId', () => {
        it('should update a task and return 200', async () => {
            const updateData = {
                title: 'Updated Task',
                status: 'IN_PROGRESS',
                priority: 'LOW',
            };

            const mockResponse = {
                message: 'Task updated successfully',
                task: {
                    id: 'task-123',
                    ...updateData,
                    projectId: 'project-123',
                    updatedAt: new Date(),
                },
            };

            taskService.updateTask.mockResolvedValueOnce(mockResponse);

            const response = await request(app)
                .put('/project-123/tasks/task-123')
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Task updated successfully');
            expect(response.body.task.title).toBe('Updated Task');
            expect(taskService.updateTask).toHaveBeenCalledWith(
                'project-123',
                'task-123',
                'test-user-123',
                updateData
            );
        });

        it('should return 400 on validation error', async () => {
            taskService.updateTask.mockRejectedValueOnce(new Error('Task title cannot be empty'));

            const response = await request(app)
                .put('/project-123/tasks/task-123')
                .send({ title: '   ' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task title cannot be empty');
        });

        it('should return 400 when task not found', async () => {
            taskService.updateTask.mockRejectedValueOnce(
                new Error('Task not found in this project')
            );

            const response = await request(app)
                .put('/project-123/tasks/invalid-task')
                .send({ title: 'Test' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task not found in this project');
        });

        it('should handle partial updates', async () => {
            const partialUpdate = { status: 'DONE' };
            const mockResponse = {
                message: 'Task updated successfully',
                task: {
                    id: 'task-123',
                    title: 'Original Title',
                    status: 'DONE',
                    projectId: 'project-123',
                },
            };

            taskService.updateTask.mockResolvedValueOnce(mockResponse);

            const response = await request(app)
                .put('/project-123/tasks/task-123')
                .send(partialUpdate);

            expect(response.status).toBe(200);
            expect(response.body.task.status).toBe('DONE');
        });
    });

    describe('DELETE /:projectId/tasks/:taskId', () => {
        it('should delete a task and return 200', async () => {
            const mockResponse = { message: 'Task deleted successfully' };

            taskService.deleteTask.mockResolvedValueOnce(mockResponse);

            const response = await request(app).delete('/project-123/tasks/task-123');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Task deleted successfully');
            expect(taskService.deleteTask).toHaveBeenCalledWith(
                'project-123',
                'task-123',
                'test-user-123'
            );
        });

        it('should return 400 when user lacks permission', async () => {
            taskService.deleteTask.mockRejectedValueOnce(
                new Error('You do not have permission to delete this task')
            );

            const response = await request(app).delete('/project-123/tasks/task-123');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('You do not have permission to delete this task');
        });

        it('should return 400 when task not found', async () => {
            taskService.deleteTask.mockRejectedValueOnce(
                new Error('Task not found in this project')
            );

            const response = await request(app).delete('/project-123/tasks/invalid-task');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Task not found in this project');
        });

        it('should return 400 when project not found', async () => {
            taskService.deleteTask.mockRejectedValueOnce(
                new Error('Project not found in this workspace')
            );

            const response = await request(app).delete('/invalid-project/tasks/task-123');

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Project not found in this workspace');
        });
    });

    describe('Authentication', () => {
        it('should pass authenticated user ID to all endpoints', async () => {
            taskService.createTask.mockResolvedValueOnce({
                message: 'Task created successfully',
                task: { id: 'task-123' },
            });

            await request(app)
                .post('/project-123/tasks')
                .send({ title: 'Test' });

            expect(taskService.createTask).toHaveBeenCalledWith(
                'test-user-123',
                expect.any(String),
                expect.any(Object)
            );
        });
    });
});
