# New Gameshow buzzers

## Overview
The project structure is a bit annoying to get your head around

## Folder Structure
```
src/
├── client/                  # Client-side application (React stuff with Vite to gen the static files)
│   ├── src/                
│   ├── vite.config.ts          # vite config
│   └── package.json            # Client dependencies
└── server/                 # Server-side application (serves both api requests and the static frontend files)
    ├── src/              
    │   ├── api/                # API route handlers
    │   └── server.ts      
    ├── dist/               # Main Distribution code, this is what the containers will use 
    │   ├── client/             # Where the final build static assets are stored
    │   ├── api/                # Source code for the api endpoints server.js will use
    │   └── server.js           # Server entry point
    ├── tsconfig.json       # ts configuration
    └── package.json        # Server dependencies
```

## Watch out
- The **server** serves static files and handles API requests.
- The **client** is built using Vite, and the build artifacts are stored in the `dist/client` folder inside the `server` directory.
- A single Node.js instance serves both the client build and the server's API. 

## How?
1. The **client** application is built using Vite:
   - Build artifacts are stored in `src/server/dist/client`.
   - Static files are served by the server (`src/server/dist/server.js`) using express.

2. The **server**:
   - Compiled from TypeScript to JavaScript (output in `src/server/dist`).
   - Serves the client build and handles API requests.

3. During development:
   - The server runs from `server/dist`.
   - The client build (`client/dist/client`) is served from a second node instance (if you use vite, which you should for HMR).
   - when developing  └──> This source folder is where the 'client' build is (a bit annoying but it makes deployment easier)
3. During production:
   - The server runs from `server/dist`.
   - The client build (`server/dist/client`) is served as static content.

## Scripts
The server and the client direcotries both have their own package.json folder with seperate scripts
- **Server**:
  - `npm run build` (TypeScript compilation)
  - `npm start` (Run the compiled server)
- **Client**:
  - `npm run dev` (Run Vite in development mode)
  - `npm run build` (Build the client application, eg. regenerate the static files in `src/server/dist/client`)

---


