const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) return res.status(401).json({ message: 'Thiếu token xác thực' });
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId || payload.id || payload._id;
    
    if (!req.userId) return res.status(401).json({ message: 'Lỗi Token: Không tìm thấy ID người dùng' });
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Truy cập bị từ chối. Khu vực chỉ dành cho Quản trị viên!' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Lỗi kiểm tra quyền Admin', error: err.message });
    }
};

module.exports = { authMiddleware, isAdmin };