import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from './routes/contactRoutes.js'; 
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';



dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const app = express();

app.use(cors());
app.use(express.json());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  callbackURL: 'http://localhost:3000/auth/google/callback' // Replace with your redirect URI
}, (accessToken, refreshToken, profile, done) => {
  // Handle the user profile obtained from Google
  // You can perform additional actions like saving the user to a database
  done(null, profile);
}));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Redirect or respond as needed after successful authentication
  res.redirect('/dashboard');
});


// Define your routes
app.use('/api/user', routes);



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
