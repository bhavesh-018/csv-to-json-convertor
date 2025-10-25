// report.js
const pool = require('../db/db');

async function getAgeDistribution() {
  const res = await pool.query('SELECT age FROM public.users WHERE age IS NOT NULL');
  const ages = res.rows.map(r => parseInt(r.age, 10)).filter(n => !Number.isNaN(n));
  const total = ages.length || 1;
  const groups = { '< 20': 0, '20 to 40': 0, '40 to 60': 0, '> 60': 0 };
  ages.forEach(a => {
    if (a < 20) groups['< 20']++;
    else if (a <= 40) groups['20 to 40']++;
    else if (a <= 60) groups['40 to 60']++;
    else groups['> 60']++;
  });
  const result = {};
  for (const [k,v] of Object.entries(groups)) {
    result[k] = Math.round((v / total) * 100);
  }
  // print nice table
  console.log('\nAge-Group  | % Distribution');
  Object.entries(result).forEach(([k,v]) => {
    console.log(`${k.padEnd(10)} | ${String(v).padStart(3)}`);
  });
  return result;
}

module.exports = { getAgeDistribution };