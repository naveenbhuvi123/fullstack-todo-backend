import express from "express";
import { createTask, getAllTask,deleteTask,updateTask,getTaskById } from "../controllers/taskController.js"; // ✅ Fixed import
import protect from "../middlewares/middleware.js";

const router = express.Router();

// Middleware to check for empty input in POST requests
const checkInput = (req, res, next) => {
    if (req.method === "POST" && !Object.keys(req.body).length) {
        return res.status(400).json({ status: "failure", message: "Input is empty" });
    }
    next();
};

const checkPutInput = (req, res, next) => {
    if (req.method === "PUT" && !Object.keys(req.body).length) {
        return res.status(400).json({ status: "failure", message: "Input is empty" });
    }
    next();
};

// ✅ Correct API routes
router.get('/tasks',protect, getAllTask);
router.get('/tasks/:id',protect, getTaskById); // ✅ Fixed function name
router.post('/tasks',protect, checkInput, createTask);
router.put('/tasks/:id',protect, checkPutInput,updateTask);   // ✅ Use plural for consistency
router.delete('/tasks/:id',protect, deleteTask);

export default router;
