const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0/onetoonechat').then(() => {
    console.log('Connected to MongoDB...');
})