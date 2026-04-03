const Flight = require('../models/Flight');
const BlogPost = require('../models/BlogPost');
const FeaturedDestination = require('../models/FeaturedDestination');
const Airport = require('../models/Airport');

exports.getFlights = async (req, res) => {
    try {
        const { dep, arr, depDate } = req.query;
        
        let query = {};

        if (dep) {
        
            query.dep = { $regex: dep, $options: 'i' }; 
        }
        
        if (arr) {
            query.arr = { $regex: arr, $options: 'i' };
        }
        
        if (depDate) {
        
            query.depDate = depDate; 
        }

        const flights = await Flight.find(query);
        
        res.status(200).json(flights);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu chuyến bay", error: err.message });
    }
};

exports.getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getDestinations = async (req, res) => {
  try {
    const items = await FeaturedDestination.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAirports = async (req, res) => {
  try {
    const airports = await Airport.find();
    res.json(airports);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};