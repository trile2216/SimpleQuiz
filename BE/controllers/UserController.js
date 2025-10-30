const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { toUserDTO } = require('../mappers/UserMapper');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Người dùng đã tồn tại' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, admin: false });
    await newUser.save();
    res.status(201).json({ message: 'Đăng ký người dùng thành công' });
};

exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });

    if (existing) return res.status(400).json({ message: 'Người dùng đã tồn tại' });  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, admin: true });
    await newUser.save();

    res.status(201).json({ message: 'Tạo tài khoản admin thành công' });
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

exports.logout = async (req, res) => {
    
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Người dùng chưa xác thực' });   

    res.json({ message: 'Đăng xuất thành công!' });
};

exports.getAll = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users.map(toUserDTO));
};

exports.getOne = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(toUserDTO(user));
};

exports.update = async (req, res) => {
    const updates = req.body;
    if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(toUserDTO(user));
};

exports.delete = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ message: 'Xóa người dùng thành công' });
};

