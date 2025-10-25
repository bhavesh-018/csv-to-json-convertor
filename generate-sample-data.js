const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'users.csv');
const rows = 50000; // change this if you want even more

let csv = 'name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender\n';

const firstNames = ['Rohit', 'Priya', 'Ankit', 'Sonia', 'Neha', 'Vikram', 'Arjun', 'Simran', 'Kiran', 'Rahul'];
const lastNames = ['Prasad', 'Sharma', 'Patil', 'Verma', 'Iyer', 'Singh', 'Gupta', 'Nair', 'Reddy', 'Bansal'];
const cities = ['Pune', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'];
const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Telangana', 'UP'];
const genders = ['male', 'female', 'other'];

for (let i = 0; i < rows; i++) {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const age = Math.floor(Math.random() * 80) + 10; // 10 - 90
  const address1 = `House-${i + 1}`;
  const address2 = `Street-${Math.floor(Math.random() * 100)}`;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const gender = genders[Math.floor(Math.random() * genders.length)];

  csv += `${first},${last},${age},${address1},${address2},${city},${state},${gender}\n`;
}

fs.writeFileSync(filePath, csv);
console.log(`✅ Generated ${rows} sample rows at: ${filePath}`);