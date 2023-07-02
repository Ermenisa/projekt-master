const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require('./routes/auth');

//Import and set up the authentication routes
app.use('/auth', authRoutes);

const userRoutes = require('./routes/user');

// ...

app.use('/user', userRoutes);

const adminRoutes = require('./routes/admin');

// ...

app.use('/admin', adminRoutes);


const geocodingRoutes = require('./routes/geocoding');

// ...

app.use('/geocoding', geocodingRoutes);


const statisticsRoutes = require('./routes/statistics');

// ...

app.use('/statistics', statisticsRoutes);
