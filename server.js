const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');
const { Post } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to handle form submission
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    // Create a new post using the Post model
    await Post.create({ title, content });
    res.redirect('/');
  } catch (err) {
    console.error('Error inserting post', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the home page
app.get('/', async (req, res) => {
  try {
    // Fetch all posts from the database using the Post model
    const posts = await Post.findAll({ order: [['created_at', 'DESC']] });
    res.render('home', { posts });
  } catch (err) {
    console.error('Error fetching posts', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
