# E-Commerce Platform

## Description
Designed and developed a full-stack e-commerce platform with React for the frontend and Node.js with Express.js for the backend. Integrated MongoDB for database management and Cloudinary for handling media uploads. Implemented key features such as user authentication, product listings, and a shopping cart.

## Features
- User authentication (Signup, Login, Logout)
- Product listing with detailed views
- Shopping cart functionality
- Secure checkout process
- Cloudinary integration for media storage
- Responsive and modern UI

## Tech Stack
### Frontend
- React.js
- Redux (for state management)
- Tailwind CSS (for styling)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- Cloudinary (for media uploads)

## Installation

### Prerequisites
- Node.js installed
- MongoDB installed and running
- Cloudinary account for media storage

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/AbdullahM196/e-commerceApi.git
   ```
2. Clone the admin Side repository:
   ```sh
   git clone https://github.com/AbdullahM196/e-commerce-adminSide.git
   ```
3. Clone the user Side repository:
   ```sh
   git clone https://github.com/AbdullahM196/e-commerce-userSide.git
   ```
4. Install dependencies:
   ```sh
   npm install  
   ```
3. Set up environment variables for api:
   - Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```
5. Start the frontend:
   ```sh
   npm run dev
   ```
6. preview admin Side:
   - email : email:abdullahM196@gmail.com
   - password : Abdullah_196
   - [link](https://e-shop-admin1.web.app/)
     
7. preview user side:
   [link](https://e-shop123.web.app/)
   
## Contact
For any inquiries or issues, please contact Abdullah mahmoud at [abdullah.mahmoud.f196@gmail.com].

