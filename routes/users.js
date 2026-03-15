var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// 1) C R (get all, get theo id) U D (xoá mềm)
// GET ALL
router.get('/', async function (req, res, next) {
    try {
        let result = await userModel.find({ isDeleted: false }).populate('role');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET BY ID
router.get('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!result) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel(req.body);
        let result = await newUser.save();
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE
router.put('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!result) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE (Soft Delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!result) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, message: "Soft deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2) Viết 1 hàm post /enable truyền lên email và username nếu thông tin đúng thì chuyển status về true
router.post('/enable', async function (req, res, next) {
    try {
        const { username, email } = req.body;
        let result = await userModel.findOneAndUpdate(
            { username, email, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!result) {
            return res.status(400).json({ success: false, message: "Invalid info or user not found" });
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3) Viết 1 hàm post /disable truyền lên email và username nếu thông tin đúng thì chuyển status về false
router.post('/disable', async function (req, res, next) {
    try {
        const { username, email } = req.body;
        let result = await userModel.findOneAndUpdate(
            { username, email, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!result) {
            return res.status(400).json({ success: false, message: "Invalid info or user not found" });
        }
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
