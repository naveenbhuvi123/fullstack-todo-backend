import todosModel from '../model/todosModel.js';

const createTask = async (req, res) => {
    try {
        const taskDetails = req.body;
        const task = await todosModel.create(taskDetails);
        res.status(200).json({
            status: 'success',
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: error.message,
        });
    }
};

const getAllTask = async (req, res) => {
    try {
        const taskDetails = await todosModel.find();
        if (taskDetails.length === 0) {
            return res.status(404).json({
                status: 'failure',
                message: 'No tasks found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: taskDetails,
        });
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: error.message,
        });
    }
};


const getTaskById = async (req, res) => {
    const taskId= req.params.id;
    try {
        const task = await todosModel.findById(taskId);
        if(!task){
            return res.status(404).json({
                status:'failure',
                message:`Task with id ${taskId} not found`
            });
        }
        res.status(200).json({
            status:'success',
            task,
        })
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: error.message,
        });
    }
};



const updateTask = async (req, res) => {
    const taskId= req.params.id;
    const updateTaskData = req.body;
    try {
        const updatedtask = await todosModel.findByIdAndUpdate(taskId, updateTaskData,{new:true, runValidators:true});
        if(!updatedtask){
            return res.status(404).json({
                status:'failure',
                message:`Task with id ${taskId} not found`
            });
        }
        res.status(200).json({
            status:'success',
            message:'Task updated successfully',
            task:updatedtask
        })
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: error.message,
        });
    }
};


const deleteTask = async (req, res) => {
    const taskId= req.params.id;
    try {
        const task = await todosModel.findByIdAndDelete(taskId);
        if(!task){
            return res.status(404).json({
                status:'failure',
                message:`Task with id ${taskId} not found`
            });
        }
        res.status(200).json({
            status:'success',
            message:'Task Deleted successfully',
        })
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: `${error.message }  Task not found`,
        });
    }
};

// ✅ Correct ES Module export
export { createTask, getAllTask, updateTask, deleteTask,getTaskById };
