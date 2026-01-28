# Blog App

A React-based blogging platform with user authentication, blog management, and likes functionality.

## Features

- User authentication (Login/Signup)
- Create, read, edit, and delete blogs
- Like and unlike blogs
- View your own blogs
- View all blogs from the community

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-app
```

2. Install dependencies:
```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_API_URL=http://localhost:3000
```

For production (Vercel), set the environment variable in your Vercel dashboard:
- Variable name: `VITE_API_URL`
- Value: Your backend API URL (e.g., your Heroku backend URL)

## Development

### Start the Backend Server

In a new terminal, run:
```bash
npm run server
```

This starts the json-server on `http://localhost:3000`

### Start the Frontend

In another terminal, run:
```bash
npm run dev
```

This starts the Vite development server on `http://localhost:5173`

## Production Deployment

### Option 1: Deploy on Vercel (Frontend only)

**Important**: Your backend server needs to be deployed separately!

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Create a new project and connect your GitHub repository
4. Add environment variables in the Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### Option 2: Deploy Backend to Heroku or Firebase

Choose one of these options for your backend:

**Heroku Backend:**
```bash
# Create a new Heroku app
heroku create your-app-name

# Push your db.json and server.js
git push heroku main
```

Then set `VITE_API_URL` in Vercel to your Heroku backend URL.

**Firebase Realtime Database:**
Consider migrating from json-server to Firebase for a production-ready backend.

## Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run server` - Start json-server backend
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── BlogCard.jsx
│   └── Navbar.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── AddBlog.jsx
│   ├── EditBlog.jsx
│   └── MyBlogs.jsx
├── context/
│   └── AuthContext.jsx
├── App.jsx
├── main.jsx
└── main.css
```

## Troubleshooting

### Edit/Delete Not Working
- Ensure the backend server is running on port 3000
- Check that `VITE_API_URL` environment variable is set correctly
- Check browser console for CORS errors

### Build Fails
- Clear `node_modules` and reinstall: `npm install`
- Clear the build cache: `rm -rf dist node_modules/.vite`
- Check for syntax errors: `npm run lint`

### API Endpoint Issues
- Verify backend is running: `curl http://localhost:3000/blogs`
- Check network requests in browser DevTools
- Verify `db.json` exists and is valid JSON

## Database Schema

### Users
```json
{
  "id": "1",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Blogs
```json
{
  "id": "1",
  "title": "My First Blog",
  "description": "Blog content...",
  "image": "https://example.com/image.jpg",
  "author": "john_doe",
  "authorId": "1",
  "likes": 5,
  "likedBy": [1, 2, 3],
  "createdAt": "2024-01-27T10:00:00.000Z",
  "updatedAt": "2024-01-27T10:00:00.000Z"
}
```

## License

MIT