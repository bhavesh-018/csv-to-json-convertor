// inserter.js
const pool = require('./db');

async function insertInBatches(rows, batchSize = 1000) {
  if (!rows.length) return 0;
  const client = await pool.connect(); // ← this line needs a Pool instance
  try {
    await client.query('BEGIN');
    for (let i = 0; i < rows.length; i += batchSize) {
      const chunk = rows.slice(i, i + batchSize);
      const vals = [];
      const placeholders = chunk.map((r, idx) => {
        const base = idx * 4;
        vals.push(r.name);
        vals.push(r.age);
        vals.push(r.address ? JSON.stringify(r.address) : null);
        vals.push(r.additional_info ? JSON.stringify(r.additional_info) : null);
        return `($${base + 1}, $${base + 2}, $${base + 3}::jsonb, $${base + 4}::jsonb)`;
      });
      const sql = `INSERT INTO public.users (name, age, address, additional_info)
                   VALUES ${placeholders.join(', ')}`;
      await client.query(sql, vals);
    }
    await client.query('COMMIT');
    return rows.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { insertInBatches };