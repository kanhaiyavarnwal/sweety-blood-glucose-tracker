sweety-blood-glucose-tracker


A full-stack Blood Glucose Tracking Application that helps users record, monitor, and analyze their blood glucose levels through daily and monthly reports.


Users can manage their glucose readings, view dashboard statistics, track historical trends, and manage their account securely.

Features

Authentication

    User registration and login.

    JWT-based authentication.

    Password hashing using bcrypt.

    Protected application routes.

    Change password functionality.


Glucose Readings

    Add daily blood glucose readings.

    View all glucose readings.

    Update existing readings.

    Delete readings.

    Categorize readings by time slot:

        Morning (Fasting)

        After Breakfast

        After Lunch

        After Dinner


Dashboard

    Today's glucose overview.

    Monthly glucose statistics.

    Average glucose levels.

    Highest and lowest readings.

    Recent glucose readings.

    Monthly glucose trend chart.

Reports

    Generate daily reports.

    Generate monthly reports.

    View daily reading details.

    Analyze average, highest, and lowest glucose levels.

Profile Management

    View account information.

    Update profile name.

    Change account password.

Tech Stack

    Frontend

        React 19

        Vite

        React Router DOM

        Tailwind CSS 4

        Axios

        Recharts

        Lucide React

        React Hot Toast

    Backend

        Node.js

        Express.js 5

        PostgreSQL

        PostgreSQL Node.js driver (pg)

        JWT (JSON Web Token)

        bcrypt

        CORS

        dotenv


Project Structure

    sweety-blood-glucose-tracker/
    |
    |--backend/
    |  |--src/
    |    |--config/
    |    |--controllers/
    |    |--middleware/
    |    |--routes/
    |    |--index.js/
    |    |--.env
    |    |--.gitignore/
    |    |--package-lock.json/
    |    |--package.json/
    |    
    |
    |--frontend/
    |   |--src/
    |      |--components/
    |      |--context/
    |      |--layout/
    |      |--pages/
    |      |--services/
    |      |--App.jsx/
    |      |--index.css/
    |      |--main.jsx/
    |      |--.env/
    |      |--.gitignore/
    |      |--index.html/
    |      |--package-lock.json/
    |      |--package.json/
    |      |--vite.config.js/
    |
    |
    |--Screenshot
    |
    |--README.md
    |
    |


Prerequisites
    Before running the application, make sure you have installed:

      (a)  Node.js(LatestVersion recommended)

      (b)  npm

      (c)  PostgreSQL

      (d) Git


Installation & Setup
  
  1. Clone the Repository

    Open terminal and execute one by one first-> (a) then -> (b) 

    a. git clone https://github.com/kanhaiyavarnwal/sweety-blood-glucose-        tracker.git

    b. cd sweety-blood-glucose-tracker

  2. Backend Setup

      Open terminal and execute
 
      cd backend

    Install dependencies:

        npm install

    Create a .env file in the backend directory.

    PORT=5000

    DB_HOST=localhost


    DB_PORT=your db port


    DB_NAME=your db name


    DB_USER=db user_name


    DB_PASSWORD="your postgresql password"

    JWT_SECRET=as you want to keep

Note: These are suggested environment variable names. Ensure they match the variables used in your backend source code.

3. Database Setup

    Install and start PostgreSQL.

    Open PostgreSQL using pgAdmin or psql.

    Create a database:

    CREATE DATABASE  DB_NAME  ;  // same as .env file

    Configure the database connection string in the backend .env file.

    Run your database schema or migration setup to create the required tables.

4. Start Backend Server

    Development mode:

    npm run dev

    Backend server: http://localhost:5000 

5. Frontend Setup

    Open another terminal:

        cd frontend

    Install dependencies:

    npm install

    Create a .env file: 

    VITE_API_URL=http://localhost:5000/api

Note: Update the API URL according to your actual backend route prefix and    Axios configuration.

6. Start Frontend

 Run the development server:

     npm run dev

     Open the chrome:

     http://localhost:5173  // paste it on your chrome tab

Environment Variables

     Never commit actual .env files or sensitive credentials to GitHub.

Date and Time Handling

    The application uses UTC timestamps for storing date-time values and Asia/Kolkata for displaying dates in   
    the Indian timezone.

    Daily and monthly report calculations should use Indian timezone boundaries to prevent date mismatches.


Notes

    Assumptions

        PostgreSQL is used as the primary database.

        The backend runs separately from the React frontend.

        JWT is used to authenticate users.

        Reports are calculated from stored glucose readings.

        Indian Standard Time (IST) is used for report date display.

    Future Improvements

        With more development time, I would like to add:
            
            Email verification and password reset.

            Deployment monitoring and performance optimization

            Improved data visualization and analytics.


 Author
   Kanhaiya Varnwal

   Full Stack Developer | React.js | Node.js | Express.js | PostgreSQL

    GitHub: https://github.com/kanhaiyavarnwal