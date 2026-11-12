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
    |--README.md
    |
    |


Prerequisites
    Before running the application, make sure you have installed:
        Node.js(LatestVersion recommended)

        npm

        PostgreSQL

        Git


Installation & Setup
  