var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// 1) C R (get all, get theo id) U D (xoá mềm)
// GET ALL
router.get('/', async function (req, res, next) {
    try {
        let result = await roleModel.find({ isDeleted: false });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET BY ID
router.get('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!result) return res.status(404).json({ success: false, message: "Role not found" });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel(req.body);
        let result = await newRole.save();
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE
router.put('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!result) return res.status(404).json({ success: false, message: "Role not found" });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE (Soft Delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!result) return res.status(404).json({ success: false, message: "Role not found" });
        res.status(200).json({ success: true, message: "Soft deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4) Viết request get để lấy tất cả các user có role là id
router.get('/:id/users', async function (req, res, next) {
    try {
        let users = await userModel.find({ role: req.params.id, isDeleted: false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
