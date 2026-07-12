const sendSuccess = (res, data = null, meta = null, message = null, statusCode = 200) => {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  if (message) payload.message = message;
  return res.status(statusCode).json(payload);
};

const sendCreated = (res, data, message = 'Created successfully') =>
  sendSuccess(res, data, null, message, 201);

module.exports = { sendSuccess, sendCreated };
