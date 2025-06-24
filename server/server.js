const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);


const User = require('./models/User');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

app.post('/signup', async (req, res) => {
  const { email } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.json({ success: false, error: "You’ve already signed up!" });
  }
  try {
    const user = new User({ email });
    await user.save();

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Welcome to our SaaS!',
      text: 'Thanks for signing up! Stay tuned for more updates.'
    });

    res.json({ success: true });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
