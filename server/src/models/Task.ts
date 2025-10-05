import mongoose, { Schema } from 'mongoose';
import { ITask, TaskStatus } from '../types';

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
    required: true
  },
  assignedUser: {
    type: String,
    required: [true, 'Assigned user is required'],
    trim: true
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value >= new Date();
      },
      message: 'Due date cannot be in the past'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      (ret as any).id = ret._id;
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Index for better query performance
TaskSchema.index({ assignedUser: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });

// Virtual for checking if task is overdue
TaskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== TaskStatus.DONE;
});

export default mongoose.model<ITask>('Task', TaskSchema);