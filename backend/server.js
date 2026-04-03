const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dataRoutes = require('./routes/dataRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydb')
  .then(() => console.log('Kết nối MongoDB thành công!'))
  .catch((error) => console.error('Lỗi kết nối MongoDB:', error));

app.use('/api', authRoutes);
app.use('/api', dataRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/bookings', bookingRoutes); 
app.use('/api/users', userRoutes);
const { startCronJobs } = require('./utils/cronJobs');
startCronJobs();

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});