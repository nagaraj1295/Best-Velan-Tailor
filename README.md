# Best Velan Tailors

![Best Velan Tailors Logo](frontend/public/assets/logo.webp)

Welcome to the **Best Velan Tailors** project repository! This is a modern, responsive, full-stack web application designed for a premium tailoring business in Alanganallur. It provides a luxurious landing page for customers and a powerful analytics-driven dashboard for the shop administrator.

## 🚀 Live Demo

The application is deployed on Vercel:
**[Best Velan Tailors - Live Site](https://best-velan-tailor.vercel.app)**

## 🌟 Key Features

### For Customers
* **Luxurious Landing Page:** A modern, beautifully animated landing page showcasing tailoring services, crafted with responsive design for all devices.
* **Instant Order Status:** Customers can securely check their order status (e.g., Cutting & Sizing, Stitching in Progress, Ready for Pickup) using their 10-digit mobile number and Order ID.
* **Feedback System:** A seamless modal allowing customers to leave feedback directly on the website.

### For Administrators (Admin Dashboard)
* **Secure Authentication:** Protected admin routes utilizing JWT middleware and Axios interceptors for a highly secure session.
* **Order Management:** Create new orders, instantly update order statuses, and automatically track repeat customers.
* **WhatsApp Integration:** 1-click WhatsApp notification templates to alert customers of their order status dynamically directly from the dashboard.
* **Comprehensive Analytics:** Visual graphs and statistics breaking down orders by Today, Yesterday, Last 7 Days, Last 30 Days, This Year, and Total. Includes date-range filtering.
* **Customer Directory:** Track returning customers, total visit counts, and their last visit dates.
* **Feedback Triage:** Categorize incoming customer feedback as "Positive" or "Improvement" for business insights.

## 🛠 Technology Stack

### Frontend (Client)
* **React.js** (Vite Build Tool)
* **Recharts** (Data Visualization)
* **Lucide React** & **FontAwesome** (Icons)
* **Vanilla CSS** (Custom, lightweight styling without heavy frameworks)
* **Axios** (API Requests with Interceptors)

### Backend (Server)
* **Node.js** & **Express.js** (RESTful API)
* **MongoDB** & **Mongoose** (Database & Schema Modeling)
* **JSON Web Tokens (JWT)** (Secure API Authentication)
* **Bcrypt.js** (Password Hashing)
* **CORS & Dotenv** (Environment Configuration)

## 📁 Project Structure

* `/frontend` - Contains the Vite/React application, routing, pages (`Home.jsx`, `AdminDashboard.jsx`), and components.
* `/backend` - Contains the Express server, MongoDB models (`Order.js`, `Customer.js`, `Feedback.js`, `Admin.js`), middleware, and API routes.

## ⚙️ Performance & Security
* Admin endpoints are strictly protected by `authMiddleware.js`.
* Input validation and phone number normalization ensure database robustness.
* Assets are optimized (e.g., `.webp` imagery, external CDNs) for exceptionally fast load times.
