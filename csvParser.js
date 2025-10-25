// csvParser.js
const fs = require('fs');

function parseCSVText(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  const rows = [];
  let i = 0, field = '', inQuotes = false;
  const headers = [];

  // helper to read one record (returns array of fields or null if EOF)
  const readRecord = () => {
    const fields = [];
    field = '';
    inQuotes = false;
    while (i < text.length) {
      const ch = text[i];

      if (ch === '"') {
        if (inQuotes && text[i+1] === '"') {
          field += '"'; // escaped quote
          i += 2;
          continue;
        }
        inQuotes = !inQuotes;
        i++;
        continue;
      }

      if (!inQuotes && ch === ',') {
        fields.push(field);
        field = '';
        i++;
        continue;
      }

      if (!inQuotes && (ch === '\n' || ch === '\r')) {
        fields.push(field);
        field = '';
        // handle \r\n
        if (ch === '\r' && text[i+1] === '\n') i += 2;
        else i++;
        return fields;
      }

      field += ch;
      i++;
    }

    // EOF
    if (field !== '' || i >= text.length) {
      fields.push(field);
      return fields;
    }
    return null;
  };

  // read header
  const hdr = readRecord();
  if (!hdr) throw new Error('CSV header missing or empty');
  for (const h of hdr) headers.push(h.trim());

  // read rest
  while (i <= text.length) {
    const rec = readRecord();
    if (!rec) break;
    // if last row empty (single empty field) skip
    if (rec.length === 1 && rec[0] === '' && i >= text.length) break;
    rows.push(rec);
  }

  return { headers, rows };
}

function parseCSVFileSync(path) {
  const content = fs.readFileSync(path, 'utf8');
  return parseCSVText(content);
}

module.exports = { parseCSVText, parseCSVFileSync };
