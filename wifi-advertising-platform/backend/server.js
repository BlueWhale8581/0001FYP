const app = require('./app.js');
require('dotenv/config');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "FYP WiFi Advertising Platform is on live" });
});