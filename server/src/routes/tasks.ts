import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - assignedUser
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: The title of the task
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: The description of the task
 *         status:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *           description: The status of the task
 *         assignedUser:
 *           type: string
 *           description: The user assigned to the task
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date of the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the task was last updated
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - assignedUser
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *           maxLength: 1000
 *         status:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *         assignedUser:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *     UpdateTaskRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *         description:
 *           type: string
 *           maxLength: 1000
 *         status:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *         assignedUser:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks with filtering and pagination
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *         description: Filter by task status
 *       - in: query
 *         name: assignedUser
 *         schema:
 *           type: string
 *         description: Filter by assigned user (partial match)
 *       - in: query
 *         name: dueDateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks with due date from this date
 *       - in: query
 *         name: dueDateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks with due date until this date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of tasks per page
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalTasks:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllTasks);

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         overdue:
 *                           type: integer
 *                         byStatus:
 *                           type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', getTaskStats);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get('/:id', getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error or invalid task ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.put('/:id', updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid task ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.delete('/:id', deleteTask);

export default router;