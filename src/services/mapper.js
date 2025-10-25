// mapper.js
function assignNested(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length; i++) {
    const k = pathArr[i];
    if (i === pathArr.length - 1) {
      cur[k] = value;
    } else {
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
  }
}

function rowToNestedObject(headers, row) {
  const out = {};
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].trim();
    const val = row[i] !== undefined ? row[i].trim() : '';
    if (header === '') continue;
    const parts = header.split('.');
    assignNested(out, parts, val);
  }
  return out;
}

function mapToDbRow(nestedObj) {
  const firstName = nestedObj?.name?.firstName || '';
  const lastName = nestedObj?.name?.lastName || '';
  const ageRaw = nestedObj?.age ?? '';
  const nameCombined = `${firstName}`.trim() + (lastName ? ' ' + `${lastName}`.trim() : '');
  const age = ageRaw === '' ? null : parseInt(ageRaw, 10);

  // Address: if there is an address subtree, use it
  const address = (nestedObj.address && Object.keys(nestedObj.address).length) ? nestedObj.address : null;

  // Build additional_info by copying everything except name & age & address
  const additional = {};
  for (const k of Object.keys(nestedObj || {})) {
    if (k === 'name' || k === 'age' || k === 'address') continue;
    additional[k] = nestedObj[k];
  }
  const additional_out = Object.keys(additional).length ? additional : null;

  return {
    name: nameCombined || null,
    age,
    address,
    additional_info: additional_out,
  };
}

module.exports = { rowToNestedObject, mapToDbRow };
