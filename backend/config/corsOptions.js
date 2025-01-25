const whitelist = [
  'http://localhost:5173', 
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 204, 
};

module.exports = corsOptions;