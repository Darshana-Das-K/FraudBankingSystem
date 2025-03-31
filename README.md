# Fraudulent Loan Detection System

This project is a **Fraudulent Loan Detection System** that simulates normal and fake loan transactions in a banking environment. It consists of a **React frontend** and a **Node.js backend** with an integrated **MySQL database**. The dashboard visualizes loan and interest payments, allowing users to simulate normal and fraudulent banking activities.

## Features

- **Simulate Loans:**
  - Create normal and fraudulent loans.
- **Simulate EMI Payments:**
  - Process EMI payments for loans (both normal and fraudulent).
- **Track Asset Receivable:**
  - View total assets receivable from loans.
  - Fetch details of individual loans.
- **Interest Payment Visualization:**
  - Track interest payments for loans using bar charts.
- **Loan Overview Dashboard:**
  - Pie charts display remaining vs. paid loan amounts.
- **Transaction Log:**
  - Logs all transactions performed through the dashboard.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Recharts (for data visualization)
- **Backend:** Node.js with Express
- **Database:** MySQL
- **Libraries Used:**
  - `express`
  - `mysql2`
  - `cors`
  - `fetch API` (for frontend-backend communication)

## Installation and Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (v14+ recommended)
- MySQL Server
- npm or yarn

### Clone the Repository
```sh
git clone https://github.com/Darshana-Das-K/FraudBankingSystem.git
cd FraudBankingSystem
```

### Install Dependencies
```sh
npm install
```

## Database Setup
Since every system has different MySQL credentials, follow these steps to set up the database:

### 1. Create the Database
Log in to MySQL using your credentials:
```sh
mysql -u root -p
```
Then, create the database manually:
```sql
CREATE DATABASE FraudBanking;
```

### 2. Import the Database Schema
After creating the database, import the provided SQL file:
```sh
mysql -u root -p FraudBanking < db/fraudbanking.sql
```
Replace `root` with your MySQL username if it's different.

### 3. Configure Database Credentials in Code
Open `server.js` and update the MySQL connection details:
```js
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change if needed
    password: 'your_password', // Change if needed
    database: 'FraudBanking',
    port: 3306
});
```
Ensure you replace `your_password` with the actual MySQL password.

## Running the Project

### Start the Backend Server
```sh
node server.js
```
The backend should now be running on `http://localhost:5001/`.

### Start the Frontend Development Server
Navigate to the frontend folder and run:
```sh
cd fraud-banking-ui
npm start
```
The React app should now be running on `http://localhost:3000/`.

## API Endpoints
The frontend communicates with a backend server running on `http://localhost:5001/`. Below are the key API endpoints used:

### Loan Operations
| Endpoint                  | Method | Description                     |
|---------------------------|--------|---------------------------------|
| `/simulate-normal-loan`   | POST   | Creates a normal loan          |
| `/simulate-fake-loan`     | POST   | Creates a fake loan            |
| `/simulate-normal-emi`    | POST   | Processes EMI for a normal loan|
| `/simulate-fraudulent-emi`| POST   | Processes EMI for a fake loan  |

### Asset and Interest Tracking
| Endpoint                      | Method | Description                               |
|--------------------------------|--------|-------------------------------------------|
| `/AssetReceivable`            | GET    | Fetches list of assets receivable        |
| `/total-asset-receivable`     | GET    | Fetches total assets receivable amount   |
| `/InterestPayments`           | GET    | Fetches interest payments for all loans  |

## Database Schema

### Tables Used:
1. **Loans** (stores loan details)
2. **CreditRequests** (records credit requests for loans)
3. **AssetReceivable** (tracks outstanding loan amounts)
4. **EMI** (stores EMI payment history)
5. **PrincipalPayments** (tracks principal repayments)
6. **InterestPayments** (tracks interest payments)

## Usage Instructions
1. Click **Simulate Normal Loan** to create a normal loan.
2. Click **Simulate Fraudulent Loan** to create a fake loan.
3. Click **Simulate Normal EMI** to process an EMI payment for a loan.
4. Click **Simulate Fraudulent EMI** to process a fake EMI transaction.
5. Click **Load Asset Receivable & Interest** to update the loan overview.
6. View the **Pie Chart** for loan repayment status.
7. View the **Bar Chart** for interest payments over time.

## Future Improvements
- Implement user authentication for secure API access.
- Add a front-end interface to visualize loan transactions in more detail.
- Enhance fraud detection mechanisms using machine learning.

## Screenshots
(TODO: Add screenshots of the dashboard interface)

## Contributing
Feel free to open a pull request if you would like to contribute to the project.

## License
This project is licensed under the MIT License.

---
**Author**: [Your Name](https://github.com/Darshana-Das-K)
