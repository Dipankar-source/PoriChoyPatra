<div align="center">
  <h1>DipFolio - Personal Developer Portfolio</h1>
</div>

**DipFolio** is a modern, highly interactive, and visually striking personal portfolio built with **React**, **Vite**, and **Tailwind CSS**. Designed to showcase projects, skills, and professional experience, it leverages advanced animation libraries and 3D rendering to deliver a premium user experience.

## Key Features

*   **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
*   **Dark & Light Mode**: Seamless theme switching with global keyboard shortcuts (Ctrl + T) and smooth transitions.
*   **Advanced Animations**: Powered by **Framer Motion** for fluid page transitions, scroll animations, and interactive elements.
*   **3D Elements**: Incorporates **Three.js** and **React Three Fiber** for rendering interactive 3D models.
*   **Modern Routing**: Utilizes **React Router DOM** for fast, client-side navigation without page reloads.
*   **Custom UI Components**: Features bespoke components like a custom mouse follower, magnetic wrappers, and a dynamic premium search palette.

## Tech Stack

*   **Core**: React 19, Vite, JavaScript
*   **Styling**: Tailwind CSS 4, Tailwind Merge, CLSX
*   **Animations**: Framer Motion, Motion, TSParticles
*   **3D Rendering**: Three.js, @react-three/fiber
*   **Routing**: React Router DOM v7
*   **Icons & UI**: Radix UI, Lucide React, React Icons, Tabler Icons

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   **Node.js**: Version 18.0.0 or higher.
*   **npm** or **yarn**: Package managers for installing dependencies.

## Installation and Setup

Follow these steps to get a development environment running:

1.  **Clone the repository** (if applicable) and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open your browser**:
    Navigate to `http://localhost:5173` to view the application.

## Project Structure

A brief overview of the key directories within this frontend project:

*   **`src/`**: Contains the main application source code.
    *   **`assets/`**: Static assets like images, fonts, and sound files.
    *   **`components/`**: Reusable UI elements, interactive wrappers, and layout structures (e.g., Navbar, Hero, AboutMe).
    *   **`context/`**: React Context providers for global state management (e.g., ThemeContext).
    *   **`uicomponents/`**: Specialized or external UI components (e.g., PremiumSearch).
    *   **`App.jsx`**: The root component configuring routes and global layouts.
    *   **`main.jsx`**: The entry point of the React application.

## Available Scripts

In the project directory, you can run the following commands:

*   **`npm run dev`**: Runs the app in the development mode.
*   **`npm run build`**: Builds the app for production to the `dist` folder, optimizing the build for the best performance.
*   **`npm run lint`**: Runs ESLint to check for code quality and style issues.
*   **`npm run preview`**: Serves the production build locally for previewing before deployment.

## Acknowledgments

This project utilizes several open-source libraries and design patterns to achieve its highly interactive and premium aesthetic. Special thanks to the creators and maintainers of React, Vite, Framer Motion, and Tailwind CSS.
