var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')

// ========== READ ALL (Không cần truy vấn) ==========
router.get('/', async function (req, res, next) {
  try {
    let result = await productModel.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== READ ONE (Lấy theo ID) ==========
router.get('/:id', async function (req, res, next) {
  try {
    let result = await productModel.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi ID hoặc Server: " + error.message });
  }
});

// ========== CREATE (Tạo mới sản phẩm) ==========
router.post('/', async function (req, res, next) {
  try {
    let newProduct = new productModel(req.body);
    let result = await newProduct.save();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== UPDATE (Cập nhật theo ID) ==========
router.put('/:id', async function (req, res, next) {
  try {
    // { new: true } để trả về data mới nhất sau khi update
    let result = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== DELETE (Xóa theo ID) ==========
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await productModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
