"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = require("./register");
const login_1 = require("./login");
const task_1 = require("./task");
const router = (0, express_1.Router)();
router.post('/api/register', register_1.register);
router.post('/api/authenticate', login_1.login);
//router.patch('/api/authenticate', resetPassword)
router.get('/api/tasks', login_1.authenticate, task_1.getTasks);
router.post('/api/tasks/new', login_1.authenticate, task_1.createTask);
router.patch('/api/tasks/:taskId', login_1.authenticate, task_1.updateTask);
router.patch('/api/reorder_tasks', login_1.authenticate, task_1.reorderTasks);
router.delete('/api/tasks/:taskId', login_1.authenticate, task_1.deleteTask);
exports.default = router;
//# sourceMappingURL=index.js.map