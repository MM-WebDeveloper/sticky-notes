const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select('-password').lean();

	if (!users) {
		return res.status(400).json({ message: 'No users found' });
	}

	res.json(users);
});

// @desc Register a new user
// @route POST /users
// @access Private
const registerNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;

	// Confirm data is set
	if (!username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	// Check for duplicates
	const duplicate = await User.findOne({ username }).lean().exec();

	if (duplicate) {
		return res.status(409).json({ message: 'Duplicate username' });
	}

	// Hash password
	const hashedPwd = await bcrypt.hash(password, 12);

	const newUser = {
		username,
		password: hashedPwd,
		roles,
	};

	const user = await User.create(newUser);

	if (user) {
		res.status(201).json({ message: `New user ${username} registered` });
	} else {
		res.status(400).json({ message: 'Invalid user data receieved' });
	}
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
	getAllUsers,
	registerNewUser,
	updateUser,
	deleteUser,
};
