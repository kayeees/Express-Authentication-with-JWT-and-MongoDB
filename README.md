# Express Authentication with JWT and MongoDB

## Description
A simple Express.js application for user authentication using JSON Web Tokens (JWT) and MongoDB. Users can sign up, log in, and access protected routes with JWT-based authentication.

## Features
- User signup with email and password
- User login with email and password
- JWT-based authentication
- Passwords stored securely using bcrypt hashing

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- Cookie-parser
- Bcrypt

## Usage
1. Visit the signup page (`/signup`) to create a new user account.
2. After signing up, visit the login page (`/login`) to log in with your credentials.
3. Upon successful login, you will be redirected to the home page (`/home`).
4. Access protected routes, such as `/protected`, by including the JWT token in your request headers or cookies.

