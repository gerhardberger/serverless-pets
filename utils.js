module.exports = {
  succeed: data => ({
    statusCode: 200,
    body: JSON.stringify(Object.assign(data, { success: true }))
  }),
  fail: data => ({
    statusCode: 400,
    body: JSON.stringify(Object.assign(data, { success: false }))
  })
}
