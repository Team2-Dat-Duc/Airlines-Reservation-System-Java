require('dotenv').config();
const mongoose = require('mongoose');

const Flight = require('./models/Flight');
const BlogPost = require('./models/BlogPost');
const FeaturedDestination = require('./models/FeaturedDestination');
const Airport = require('./models/Airport');

const flightsData = require('./data/flights');
const blogPostsData = require('./data/blogPosts');
const featuredDestinationsData = require('./data/featuredDestinations');
const airportsData = require('./data/airports');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Đã kết nối MongoDB để seed dữ liệu.');

    await Promise.all([
      Flight.deleteMany({}),
      BlogPost.deleteMany({}),
      FeaturedDestination.deleteMany({}),
      Airport.deleteMany({})
    ]);

    console.log('Đã xoá dữ liệu cũ.');

    await Flight.insertMany(flightsData);
    await BlogPost.insertMany(blogPostsData);
    await FeaturedDestination.insertMany(featuredDestinationsData);
    await Airport.insertMany(airportsData);

    console.log('Seed dữ liệu thành công!');
  } catch (err) {
    console.error('Lỗi khi seed dữ liệu:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB.');
    process.exit(0);
  }
}

seed();

