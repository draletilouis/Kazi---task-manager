# Task Manager - Full Stack Application

A modern, collaborative task management application with workspaces, projects, and real-time task tracking.

## Monorepo Structure

```
task-manager/
├── backend/          # Node.js + Express + Prisma REST API
│   ├── src/
│   ├── tests/
│   ├── prisma/
│   └── README.md     # Detailed backend documentation
└── frontend/         # React + Vite SPA
    ├── src/
    └── README.md     # Frontend documentation (coming soon)
```

## Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Run Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
Backend API: `http://localhost:5000`

### Run Frontend

```bash
cd frontend
npm install  
npm run dev
```
Frontend UI: `http://localhost:5173`

---

## 🛠️ Tech Stack

### Backend
| Technology     | Purpose                           |
| -------------- | --------------------------------- |
| **Node.js**    | Backend runtime (ES modules)      |
| **Express.js** | REST API framework                |
| **Prisma ORM** | Database toolkit (SQLite for dev) |
| **JWT**        | Token-based auth system           |
| **bcrypt**     | Password hashing                  |
| **Jest**       | Testing framework                 |
| **Supertest**  | API integration testing           |

### Frontend
| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| **React 19**        | UI library                  |
| **Vite**            | Build tool & dev server     |
| **TailwindCSS**     | Utility-first CSS framework |
| **React Router**    | Client-side routing         |
| **Axios**           | HTTP client for API calls   |
| **Context API**     | State management (Auth & Toast) |
| **@dnd-kit**        | Drag-and-drop functionality |

---

## ✅ Completed Features

### Authentication System
- **Backend**: User registration & login with JWT tokens
- **Frontend**: Complete authentication UI implementation
  - Login and registration forms with validation
  - Authentication context provider for global state
  - Protected routes with automatic redirection
  - Axios interceptors for token management
  - Persistent login with localStorage
  - Navigation bar with user info and logout
- JWT access + refresh tokens (15min / 7 days)
- Email & password validation
- Secure password hashing with bcrypt
- Protected routes middleware

### Workspace Management
- **Backend**: Full CRUD API with role-based access control
- **Frontend**: Complete workspace UI implementation
  - WorkspacesPage with grid layout
  - WorkspaceCard component with edit/delete actions
  - Create/edit modals with form validation
  - Custom useWorkspaces hook for data management
  - Loading and error state handling
  - Empty state with call-to-action
  - Member management with role editing
  - Color-coded role badges (OWNER: purple, ADMIN: blue, MEMBER: gray)
  - "Make Admin" / "Make Member" toggle buttons
- Role-based access (OWNER, ADMIN, MEMBER)
- Invite/remove members
- Update member roles with confirmation dialogs

### Project Management
- **Backend**: CRUD operations with workspace integration
- **Frontend**: Project management UI
  - WorkspaceDetail page showing projects
  - ProjectCard component with View/Edit/Delete actions
  - Create/edit project modals with form validation
  - Custom useProjects hook
  - Delete project with confirmation
  - Navigation to project details
  - Toast notifications for all operations
- Project assignment to workspace members
- Role-based permissions

### Task Management
- **Backend**: Full CRUD with status and priority tracking
- **Frontend**: Advanced task board with drag-and-drop
  - **TaskBoard component** (Kanban-style with 3 columns)
    - Drag-and-drop tasks between columns (TODO → IN_PROGRESS → DONE)
    - Visual feedback during dragging with opacity and overlay
    - Automatic task status update on drop
    - Column highlighting on hover
    - Task count badges per column
  - **TaskFilterBar component** for advanced filtering
    - Filter by status (TODO, IN_PROGRESS, DONE)
    - Filter by priority (LOW, MEDIUM, HIGH)
    - Filter by assignee (all members + unassigned)
    - Search by title/description (real-time)
    - Sort by created date, due date, priority, or title
    - Clear filters button
  - **TaskCard component** with visual indicators
    - Priority dots (LOW: green, MEDIUM: yellow, HIGH: red)
    - Status badges (TODO, IN_PROGRESS, DONE)
    - Due date display with calendar emoji
    - Assignee avatars with initials
    - Click-to-navigate to task details
  - **TaskDetail page** with inline editing
    - Edit assignee with dropdown (workspace members)
    - Change status with quick action buttons
    - Change priority with quick action buttons
    - Edit/delete task functionality
    - Comment system integration
  - Custom useTasks hook for data management
- Task statuses: TODO, IN_PROGRESS, DONE
- Priority levels: LOW, MEDIUM, HIGH
- Assign/reassign tasks to members
- Due date tracking

### Comment System
- **Backend**: Add/edit/delete comments on tasks
- **Frontend**: Fully integrated comment system
  - CommentList component with edit/delete actions
  - CommentForm component for adding comments
  - Custom useComments hook for data management
  - Toast notifications for all comment operations
  - Integrated into TaskDetail page
- Chronological ordering
- Owner-only edits, role-based deletion

### UI Components Library
- **Common Components**: Button, Modal, Spinner, Input, Toast
- **Layout Components**: Navbar with user info and logout
- **Feature Components**:
  - Workspace: WorkspaceCard, WorkspaceList
  - Project: ProjectCard, ProjectForm
  - Task: TaskCard, TaskBoard, TaskForm, TaskFilterBar, DraggableTaskCard
  - Comment: CommentForm, CommentList
- **Context Providers**: AuthContext, ToastContext
- **Custom Hooks**: useWorkspaces, useProjects, useTasks, useComments, useToast
- Consistent TailwindCSS styling
- Responsive design (mobile-first approach)
- Toast notification system (success, error, warning, info)

---

## Security Features

- **JWT Authentication**: Access + refresh token rotation
- **Password Security**: bcrypt (10 salt rounds), strong validation (8+ chars, uppercase, lowercase, number)
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Email, password strength, sanitized bodies

---

## Testing

**Test Coverage**: 56/58 tests passing (96.6%)

```bash
cd backend
npm test                    # Run all tests
npm test -- task.service    # Run specific test file
npm test -- comment         # Run all comment tests
```

- **Task Service**: 14/16 (88%)
- **Task Routes**: 15/15 (100%) ✨
- **Comment Service**: 12/12 (100%) ✨
- **Comment Routes**: 15/15 (100%) ✨

---

## 📡 API Endpoints

### Authentication
```http
POST   /auth/register
POST   /auth/login
POST   /auth/refresh-token
```

### Workspaces
```http
POST   /workspaces
GET    /workspaces
PUT    /workspaces/:workspaceId
DELETE /workspaces/:workspaceId
POST   /workspaces/:workspaceId/members
DELETE /workspaces/:workspaceId/members/:userId
PUT    /workspaces/:workspaceId/members/:userId
```

### Projects
```http
POST   /workspaces/:workspaceId/projects
GET    /workspaces/:workspaceId/projects
PUT    /workspaces/:workspaceId/projects/:projectId
DELETE /workspaces/:workspaceId/projects/:projectId
```

### Tasks
```http
POST   /workspaces/:workspaceId/projects/:projectId/tasks
GET    /workspaces/:workspaceId/projects/:projectId/tasks
PUT    /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
DELETE /workspaces/:workspaceId/projects/:projectId/tasks/:taskId
```

### Comments
```http
POST   /workspaces/tasks/:taskId/comments
GET    /workspaces/tasks/:taskId/comments
PUT    /workspaces/comments/:commentId
DELETE /workspaces/comments/:commentId
```

---

## 📋 Pending Features

### Activity Logs System
- Track all user actions (create, update, delete)
- Activity feed for workspaces and projects
- User activity history
- Audit trail for compliance
- Real-time activity notifications

### Advanced Features
- **Form Validation Enhancements**
  - Real-time validation with field-level error messages
  - Email format validation in invite forms
  - Password strength meter
  - Field length limits and validation feedback
- **Better Error Handling**
  - Network retry logic with exponential backoff
  - Timeout handling for long requests
  - Offline mode detection and messaging
  - Request cancellation support
- **Loading States Consistency**
  - Skeleton loaders for better UX
  - Consistent spinner usage across all components
  - Loading indicators for async operations
- **Pagination & Performance**
  - Pagination for large task/project lists
  - Infinite scroll or page numbers
  - Virtual scrolling for performance optimization
- **User Profile & Settings**
  - User profile page with personal info
  - Settings page for user preferences
  - Password change functionality
  - Theme preferences
- **Task Enhancements**
  - Task history/activity log
  - Comment count badge on task cards
  - Rich text editor for descriptions
  - Task attachments/file uploads
  - Task tags/labels system
  - Bulk task operations
  - Subtasks and task dependencies
- **Responsive Design Improvements**
  - Mobile-optimized navigation (hamburger menu)
  - Better tablet layouts
  - Touch-friendly modal interactions

---

## Documentation

- **[Backend Documentation](./backend/README.md)** - Detailed API docs, database schema, deployment
- **Frontend Documentation** - Coming soon

## Recent Updates

### Latest Changes (2025-12-13)
- ✅ **Drag-and-Drop Task Board**
  - Installed @dnd-kit library for modern drag-and-drop
  - Created DraggableTaskCard component
  - Implemented drag-and-drop between Kanban columns
  - Added visual feedback (hover states, drag overlay, opacity)
  - Automatic task status update on drop with API integration
- ✅ **Task Filtering & Search System**
  - Created TaskFilterBar component with comprehensive filters
  - Filter by status, priority, and assignee
  - Real-time search by title/description
  - Sort by created date, due date, priority, or title
  - Clear filters button
  - Integrated with ProjectDetail page using useMemo for performance
- ✅ **Project Edit Functionality**
  - Added edit button to project cards in WorkspaceDetail
  - Created edit project modal with form validation
  - Implemented editProject in useProjects hook
  - Toast notifications for success/error states
- ✅ **Member Role Management**
  - Added updateWorkspaceMemberRole API function
  - Implemented role change UI with toggle buttons
  - Color-coded role badges (OWNER, ADMIN, MEMBER)
  - Confirmation dialogs for role changes
  - "Make Admin" / "Make Member" functionality
- ✅ **Task Assignee Editing**
  - Added inline assignee editing in TaskDetail page
  - Dropdown with workspace members for reassignment
  - "Change" button to toggle edit mode
  - Immediate update on selection with toast feedback
  - Unassigned option support
- ✅ **Toast Notification System**
  - Created ToastContext for global notifications
  - Toast component with auto-dismiss (3 seconds)
  - Color-coded by type (success, error, warning, info)
  - Replaced all alert() calls across the application

### Previous Changes (2025-12-11)
- ✅ Implemented TaskBoard component (Kanban-style with 3 columns)
- ✅ Created TaskCard component with priority and status indicators
- ✅ Added Navbar with user info and logout functionality
- ✅ Built complete workspace management UI (WorkspacesPage, WorkspaceCard)
- ✅ Implemented project management UI (WorkspaceDetail with projects)
- ✅ Added member management (invite, remove members)
- ✅ Added custom data management hooks (useWorkspaces, useProjects, useTasks)
- ✅ Created comprehensive component library for reusability
- ✅ Fixed Comment API endpoints to match backend routes

### Initial Implementation (2025-12-09)
- ✅ Implemented authentication UI with login and registration pages
- ✅ Added React Context API for global authentication state
- ✅ Configured TailwindCSS for modern, responsive styling
- ✅ Set up protected routes with automatic redirects
- ✅ Integrated authentication API client with token management
- ✅ Updated Prisma schema for authentication models

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is for educational purposes.
