// index.js
require('dotenv').config();
const express = require('express');
const { parseCSVFileSync } = require('./csvParser');
const { rowToNestedObject, mapToDbRow } = require('./mapper');
const { insertInBatches } = require('./inserter');
const { getAgeDistribution } = require('./report');
const pool = require('./db');

const app = express();
app.use(express.json());

const CSV_PATH = process.env.CSV_PATH || './data/users.csv';
const BATCH_SIZE = parseInt(process.env.INSERT_BATCH_SIZE || '1000', 10);
const PORT = parseInt(process.env.PORT || '3000', 10);

app.post('/import', async (req, res) => {
  console.log("🚀 Starting CSV import...");
  console.time("⏱️ Total Import Time"); // start timer

  try {
    const filePath = req.body.csvPath || CSV_PATH;
    const { headers, rows } = parseCSVFileSync(filePath);

    console.log(`📄 Parsed ${rows.length} rows and ${headers.length} headers from: ${filePath}`);

    const mappedRows = [];
    const ages = [];

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      while (row.length < headers.length) row.push('');
      const nested = rowToNestedObject(headers, row);
      const mapped = mapToDbRow(nested);

      // Validate mandatory fields
      if (!mapped.name || mapped.age == null || Number.isNaN(mapped.age)) {
        console.warn(`⚠️ Skipping row ${r + 1} due to missing mandatory fields`);
        continue;
      }
      mappedRows.push(mapped);
      ages.push(mapped.age);
    }

    console.log(`✅ Ready to insert ${mappedRows.length} valid rows...`);

    const inserted = await insertInBatches(mappedRows, BATCH_SIZE);
    console.log(`✅ Inserted ${inserted} rows into DB.`);

    await getAgeDistribution();

    console.timeEnd("⏱️ Total Import Time"); // end timer

    // Optional: Log memory usage
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`💾 Memory used: ${Math.round(used * 100) / 100} MB`);

    return res.json({ success: true, inserted });
  } catch (err) {
    console.timeEnd("⏱️ Total Import Time"); // still end timer even if error
    console.error('❌ Import error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/report', async (req, res) => {
  try {
    const distribution = await getAgeDistribution();
    res.json({ success: true, distribution });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
