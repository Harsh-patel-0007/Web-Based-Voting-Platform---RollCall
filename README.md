# Web-Based-Voting-Platform---RollCall

Rollcall is a web-based Election Management System designed to simplify the process of organizing and managing elections. It enables election organizers to create elections, manage candidates, enroll eligible voters, and conduct voting through a structured digital platform.

## Features

- Election Management: Create and manage elections with descriptions and scheduled opening and closing times.
- Candidate Management: Add and manage candidates for specific elections.
- Voter Enrollment: Import and manage voter details for election participation.
- Voter Verification: Verify voter eligibility before allowing access to the ballot.
- Voting System: Allow eligible voters to cast their votes during the scheduled election period.
- Election Results: Display election results based on votes received by candidates.

## 🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Other Tools: Git, GitHub

## Project Structure

Rollcall/
│
├── public/             # Frontend files
│   ├── css/
│   ├── js/
│   └── html/
│
├── controllers/         # Application logic
├── routes/              # Backend routes
├── models/              # Database operations
├── config/              # Database configuration
├── app.js               # Express application
├── server.js            # Server entry point
├── package.json
└── README.md

*The structure may vary depending on the current implementation.*

## Installation & Setup

### 1. Clone the Repository

bash
git clone https://github.com/YOUR-USERNAME/Rollcall.git

### 2. Navigate to the Project Directory

bash
cd Rollcall

### 3. Install Dependencies

bash
npm install

### 4. Configure the Database

- Create a MySQL database.
- Configure your database connection details in the project's environment configuration.
- Import or create the required database tables.

### 5. Start the Server

bash
node server.js

If the project uses a different entry point, run the corresponding file.

### 6. Open the Application

Open the frontend in your browser or access the application through the local server URL configured in the project.

## 🔮 Future Improvements

- Admin dashboard for better election management.
- Improved authentication and authorization.
- Real-time election result updates.
- Enhanced UI/UX.
- Security improvements and audit logging.

##  Developed By

Harsh
Computer Science & Engineering  
NIT Delhi

---
*Rollcall – Simplifying Election Management.*
