const fs = require('fs');
const path = require('path');

const generateSampleData = (rows = 50000) => {
  const dataDir = path.join(__dirname, '..', 'data');
  const filePath = path.join(dataDir, 'users.csv');

  // Ensure /data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created data directory.');
  }

  // If file already exists, skip regeneration (safe by default)
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  File already exists at ${filePath}. Skipping generation.`);
    console.log('   (Delete it manually if you want to regenerate.)');
    return;
  }

  console.log(`🚀 Generating ${rows} sample rows...`);

  const firstNames = ['Rohit', 'Priya', 'Ankit', 'Sonia', 'Neha', 'Vikram', 'Arjun', 'Simran', 'Kiran', 'Rahul'];
  const lastNames = ['Prasad', 'Sharma', 'Patil', 'Verma', 'Iyer', 'Singh', 'Gupta', 'Nair', 'Reddy', 'Bansal'];
  const cities = ['Pune', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'];
  const states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Telangana', 'Uttar Pradesh'];
  const genders = ['male', 'female', 'other'];

  let csv = 'name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender\n';

  for (let i = 0; i < rows; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 81) + 10; // 10–90
    const address1 = `House-${i + 1}`;
    const address2 = `Street-${Math.floor(Math.random() * 100)}`;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];

    csv += `${first},${last},${age},${address1},${address2},${city},${state},${gender}\n`;
  }

  fs.writeFileSync(filePath, csv, 'utf8');
  console.log(`✅ Generated ${rows} sample rows at: ${filePath}`);
};

// Run directly from terminal
if (require.main === module) {
  generateSampleData();
}

// Export function for programmatic use
module.exports = { generateSampleData };