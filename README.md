sweety-blood-glucose-tracker


1. A full-stack Blood Glucose Tracking Application that helps users record, monitor, and analyze their blood glucose levels through daily and monthly reports.


2. Users can manage their glucose readings, view dashboard statistics, track historical trends, and manage their account securely.

3. Features

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

4. Tech Stack

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


5. Project Structure

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


6. Prerequisites
            Before running the application, make sure you have installed:

            (a)  Node.js(LatestVersion recommended)

            (b)  npm

            (c)  PostgreSQL    (a)install

                                (b)open pgAdmin or open sql Shell

                                (c)after open pgAdmin (1)create database with same  
                                    name which is on .env file and open sql shell and connect  
                                    database to server 

                                (d) go to query Tool

                                (e)execute Query for create table // this is for  user

                                        CREATE TABLE users (
                                        id SERIAL PRIMARY KEY,
                                            name VARCHAR(100) NOT NULL,
                                            email VARCHAR(255) NOT NULL,
                                            password_hash VARCHAR(255) NOT NULL,
                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                        );

                                (f) after that execute this Query -> 
                                            CREATE UNIQUE INDEX users_email_unique
                                            ON users (LOWER(email));

                                (g) after that execute this Query for create table -> 
                                        
                                        CREATE TABLE readings (
                                        id SERIAL PRIMARY KEY,

                                            user_id INTEGER NOT NULL
                                                REFERENCES users(id)
                                                ON DELETE CASCADE,

                                            reading_date DATE NOT NULL,

                                            time_slot VARCHAR(30) NOT NULL
                                                CHECK (
                                                    time_slot IN (
                                                        'morning',
                                                        'after_breakfast',
                                                        'after_lunch',
                                                        'after_dinner'
                                                    )
                                                ),

                                            glucose_value INTEGER NOT NULL
                                                CHECK (glucose_value BETWEEN 40 AND 600),

                                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                        
                                            UNIQUE(user_id, reading_date, time_slot)
                                        );
                            
                            
            (d) Git


7. Installation & Setup
  
                (i) Clone the Repository

                    Open terminal and execute one by one first-> (a) then -> (b) 

                    a. git clone https://github.com/kanhaiyavarnwal/sweety-blood-glucose-tracker.git

                    b. cd sweety-blood-glucose-tracker

                (ii). Backend Setup

                    open forlder then  Open terminal and execute
                
                    cd backend

                (iii) Install dependencies:

                        npm install

                (iv) Create a .env file in the backend directory.

                    PORT=5000

                    DB_HOST=localhost


                    DB_PORT=your db port


                    DB_NAME=your db name


                    DB_USER=db user_name


                    DB_PASSWORD="your postgresql password"

                    JWT_SECRET=as you want to keep

Note: These are suggested environment variable names. Ensure they match the variables used in your backend source code.

8. Database Setup

                    Install and start PostgreSQL.

                    all the process in postgresql install section which is above number-5 then go to c.

                    

                    Configure the database connection string in the backend .env file.

                    Run your database schema or migration setup to create the required tables.

9. Start Backend Server

                    Development mode:

                    npm run dev

                    Backend server: http://localhost:5000 

10. Frontend Setup

            Open another terminal:

                cd frontend

             Install dependencies:

                   npm install

            Create a .env file: 

                VITE_BACKEND_URL=http://localhost:5000/api

Note: Update the API URL according to your actual backend route prefix and    Axios configuration.

11. Start Frontend

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


12. Notes

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