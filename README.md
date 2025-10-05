# Todo App - Task Management System

A full-stack task management application built with React, Node.js, TypeScript, and MongoDB.

## Features

- ✅ **User Authentication**: Secure login and registration
- ✅ **Task Management**: Create, read, update, and delete tasks
- ✅ **Priority System**: Assign HIGH, MEDIUM, or LOW priority to tasks
- ✅ **Status Tracking**: Track tasks through TODO, IN_PROGRESS, IN_REVIEW, and DONE states
- ✅ **User Assignment**: Assign tasks to different users
- ✅ **Due Dates**: Set and track task deadlines
- ✅ **Filtering & Search**: Filter by status, priority, and search by keywords
- ✅ **Dashboard**: Visual overview of task statistics
- ✅ **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Swagger** for API documentation
- **Helmet** for security headers
- **Rate limiting** for API protection

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Todo-App-Doin
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   
   **Server** (`server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

   **Client** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Client: http://localhost:3000
   - Server: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## Features

- **Complete CRUD Operations**: Create, read, update, and delete tasks
- **JWT Authentication**: Secure user registration and login
- **Task Filtering**: Filter tasks by status and due date
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **TypeScript**: Full type safety across frontend and backend
- **MongoDB Integration**: Robust data persistence with schema validation
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation

## Project Structure

```
Todo-App-Doin/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API integration services
│   │   ├── types/          # TypeScript type definitions
│   │   └── ...
│   └── package.json
├── server/                 # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── ...
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

### Environment Variables

Create `.env` files in both client and server directories with the required environment variables.

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get single task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Swagger for API documentation

## License

This project is licensed under the MIT License.