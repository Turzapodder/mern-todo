import { Request, Response } from 'express';
import Task from '../models/Task';
import { AuthRequest, CreateTaskRequest, UpdateTaskRequest, TaskQueryParams, TaskStatus } from '../types';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, assignedUser, dueDate }: CreateTaskRequest = req.body;

    // Validate required fields
    if (!title || !assignedUser) {
      res.status(400).json({
        success: false,
        message: 'Title and assigned user are required'
      });
      return;
    }

    const task = new Task({
      title,
      description,
      status: status || TaskStatus.TODO,
      assignedUser,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status,
      assignedUser,
      dueDateFrom,
      dueDateTo,
      page = 1,
      limit = 10
    }: TaskQueryParams = req.query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (assignedUser) {
      filter.assignedUser = { $regex: assignedUser, $options: 'i' };
    }

    if (dueDateFrom || dueDateTo) {
      filter.dueDate = {};
      if (dueDateFrom) {
        filter.dueDate.$gte = new Date(dueDateFrom);
      }
      if (dueDateTo) {
        filter.dueDate.$lte = new Date(dueDateTo);
      }
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limitNum);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalTasks,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTaskRequest = req.body;

    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (cleanUpdateData.dueDate) {
      cleanUpdateData.dueDate = new Date(cleanUpdateData.dueDate);
    }

    const task = await Task.findByIdAndUpdate(
      id,
      cleanUpdateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
      return;
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getTaskStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalTasks = await Task.countDocuments();
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: TaskStatus.DONE }
    });

    const formattedStats = {
      total: totalTasks,
      overdue: overdueTasks,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {} as Record<string, number>)
    };

    res.status(200).json({
      success: true,
      data: { stats: formattedStats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};