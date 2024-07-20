import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import helmet from 'helmet'; // add helmet for security
dotenv.config();

const app = express();
app.use(cors());
app.use(helmet()); // add helmet middleware

let fetcherJson = {};

try {
  fetcherJson = require('./fetcher.json'); // assuming fetcher.json is in the same directory
} catch (error) {
  console.error('Error reading fetcher.json:', error);
  process.exit(1); // exit the process if there's an error reading the file
}

// add error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.get('/:channelId.mpd', async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    res.status(400).send('Bhagle chutiya, channel ID is required!');
  } else if (Object.keys(fetcherJson).includes(channelId)) {
    const random = fetcherJson[channelId]; // get the random value from fetcher.json
    if (typeof random !== 'string' || random.trim() === '') {
      res.status(500).send('Invalid random value');
    } else {
      const redirectUrl = `https://${process.env.VERCEL_URL}/${channelId}.mpd?random=${encodeURIComponent(random)}`; // encode the random value
      res.redirect(redirectUrl);
    }
  } else {
    res.status(404).send('Channel not found');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
