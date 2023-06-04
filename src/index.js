import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from './routes/contactRoutes.js';


dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Configure passport
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback',
//   },
//   (accessToken, refreshToken, profile, done) => {
//     // Handle Google authentication
//     // Implement your logic here
//   }
// ));

const app = express();

app.use(cors());
app.use(express.json());

// Define your routes
app.use('/api/user', routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
