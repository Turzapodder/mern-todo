# Task Management System

A comprehensive full-stack Task Management System built with React (TypeScript) frontend and Node.js (Express + TypeScript) backend.

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