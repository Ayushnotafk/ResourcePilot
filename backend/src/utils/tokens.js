const crypto = require('crypto');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateDocumentNumber = (prefix) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${year}-${random}`;
};

module.exports = { hashToken, generateDocumentNumber };
