# 🧩 CSV to JSON Converter API

A Node.js + PostgreSQL application that converts CSV files into structured JSON objects and uploads them to a database.

-----

## 📂 Project Structure
```tree
csv-json-importer/
├── data/
│   └── users.csv                 # CSV file to import
├── db.js                         # PostgreSQL connection pool
├── csvParser.js                  # Custom CSV parser
├── mapper.js                     # CSV row → nested JSON → DB row
├── inserter.js                   # Batch insert logic
├── report.js                     # Age distribution calculator
├── index.js                      # Express app entry point
├── .env                          # Local environment variables (ignored)
├── .env.example                  # Template for env setup
├── package.json
├── package-lock.json
└── README.md
```
---
## ⚙️ Setup Instructions
### 1. Clone the Repository
```bash
git clone https://github.com/bhavesh-018/csv-to-json-convertor.git
cd csv-to-json-convertor
```
---
### 2. Install Dependencies
```bash
npm install
```
---
### 3. Configure Environment Variables

Create a `.env` file in the root directory and update it as needed:

```code
# PostgreSQL connection
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=your_database_name

# CSV file path (relative or absolute)
CSV_PATH=./data/users.csv

# Batch size for inserts
INSERT_BATCH_SIZE=1000

# Server port
PORT=3000
```

(You can refer to `.env.example` for a ready template.)

---
### 4. Create the Database Table

Run this SQL in pgAdmin or psql:
```sql
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    age INT NOT NULL,
    address JSONB,
    additional_info JSONB
);
```
---
### 5. Run the Application
```bash
npm start
```
---
### 6. Generate sample CSV data
You can quickly generate large test CSV files (for example, 50,000+ rows) using the provided helper script.
```bash
node helper/generate-sample-data.js
```
---
### 7. Import CSV Data

#### Option 1 — Using Postman

1. Open Postman.

2. Create a new POST request to:
```bash
http://localhost:3000/import
```
Go to the Body tab → choose raw → select JSON.

Enter one of the following:
```
{}
```

or to use a different CSV file:
```
{ "csvPath": "./data/your_custom_file.csv" }
```
Click `Send` to start the import.

---
#### Option 2 — Using macOS / Linux / Git Bash

Make sure your server is already running (from one terminal):

```bash
npm start
```

Then, in another terminal, run the following command to trigger the import:

```code
Invoke-RestMethod -Uri "http://localhost:3000/import" -Method POST -Body '{}' -ContentType "application/json"
```

Optionally, specify a different CSV file:

```code
Invoke-RestMethod -Uri "http://localhost:3000/import" -Method POST -Body '{"csvPath": "./data/users.csv"}' -ContentType "application/json"
```
---
### 8. View Age Distribution Report

Check your terminal after import — it will print a summary like:

| Age-Group  | % Distribution |
|------------|----------------|
|    < 20    |       20       |
|  20 to 40  |       45       |
|  40 to 60  |       25       |
|    > 60    |       10       |

Or, you can fetch via API:
```
GET http://localhost:3000/report
```
