const express = require('express');
const app = express();

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('views'));

// Render the index page
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});