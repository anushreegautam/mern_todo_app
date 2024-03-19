"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.createTask = exports.reorderTasks = exports.reorderAlgorithm = exports.updateTask = exports.getTasks = void 0;
const mongodb_1 = require("mongodb");
const connection_1 = require("../db/connection");
const fetchTasksAlgorithm = (userId, session) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield (0, connection_1.getDbo)().collection("tasks").find({ user_id: userId }, session ? { session } : {}).toArray();
    const sortedArray = tasks.sort((a, b) => a.sort_order > b.sort_order ? 1 : -1);
    return sortedArray;
});
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const userId = new mongodb_1.ObjectId(id);
        console.log('userId ', userId);
        const tasks = yield (0, connection_1.getDbo)().collection("tasks").find({ user_id: userId }).toArray();
        const result = tasks.sort((a, b) => a.sort_order > b.sort_order ? 1 : -1);
        // const result = await fetchTasksAlgorithm(userId)
        console.log('getTasks ', result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
});
exports.getTasks = getTasks;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = req.body;
        const { taskId } = req.params;
        console.log('updateTask ', requestBody);
        const result = yield (0, connection_1.getDbo)().collection("tasks").findOneAndUpdate({ _id: new mongodb_1.ObjectId(taskId) }, { $set: requestBody }, { returnDocument: 'after' });
        console.log('result ', result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
});
exports.updateTask = updateTask;
const reorderAlgorithm = (body, session) => __awaiter(void 0, void 0, void 0, function* () {
    const tasksCollection = (0, connection_1.getDbo)().collection("tasks");
    body.forEach(({ id, sort_order }) => __awaiter(void 0, void 0, void 0, function* () {
        const _id = new mongodb_1.ObjectId(id);
        const result = yield tasksCollection.updateOne({ _id }, { $set: { sort_order: sort_order } }, { session });
        console.log('_id ', _id, ' result ', result);
    }));
});
exports.reorderAlgorithm = reorderAlgorithm;
const reorderTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    try {
        const session = connection_1.client.startSession();
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            (0, exports.reorderAlgorithm)(requestBody, session);
        }), transactionOptions);
        res.status(204);
    }
    catch (e) {
        console.log('eerror ', e);
        res.status(500).json('Failed to update the order');
    }
    finally {
        console.log('finally');
        //await session.endSession()
    }
});
exports.reorderTasks = reorderTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, sort_order } = req.body;
        const { userId } = req.params;
        console.log('title ', title);
        console.log('sort_order ', sort_order);
        console.log('userId ', userId);
        if (!title && !sort_order) {
            res.status(422).json('Missig Parameter');
        }
        const task = { title, sort_order, is_completed: false, user_id: userId, _id: new mongodb_1.ObjectId() };
        yield (0, connection_1.getDbo)().collection("tasks").insertOne(task).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result.acknowledged) {
                const newTask = yield (0, connection_1.getDbo)().collection("tasks").findOne({ _id: result.insertedId });
                res.json(newTask);
            }
            else {
                res.status(500).json({ error: 'Internal Server error' });
            }
        })).catch(() => {
            res.status(500).json({ error: 'Internal Server error' });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, userId } = req.params;
        const userObjectId = new mongodb_1.ObjectId(userId);
        console.log('userId delete ', userId);
        const session = connection_1.client.startSession();
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield (0, connection_1.getDbo)().collection("tasks").deleteOne({ _id: new mongodb_1.ObjectId(taskId) }, { session });
            console.log('delete ', result);
            if (result.acknowledged) {
                const tasks = yield fetchTasksAlgorithm(userObjectId, session);
                const reorderRequestBody = tasks.map((task, index) => ({ _id: task._id, sort_order: index + 1 }));
                yield (0, exports.reorderAlgorithm)(reorderRequestBody, session);
                res.status(204);
            }
            else {
                res.status(500).json({ error: 'Internal Server error 1' });
            }
        }), transactionOptions);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.js.map