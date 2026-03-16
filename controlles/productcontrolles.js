const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");

// ✅ إضافة منتج (مع الفئة)
exports.AddProduct = async (req, res) => {
  try {
    console.log("1");
    const product = new Product(req.body);
    console.log("2");
    product.img = req.file.path;
    console.log("4");
    await product.save();
    console.log("5");
    return res.status(201).send({ msg: "product added" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ✅ جلب المنتجات مع إمكانية البحث والتصفية
exports.GetProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;
    
    // بناء query التصفية
    let query = {};
    
    // بحث بالاسم
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // case insensitive
    }
    
    // تصفية حسب الفئة
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // تصفية حسب السعر
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json(products);
    
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ✅ جلب منتج واحد
exports.GetOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ✅ جلب كل الفئات المتاحة
exports.GetCategories = async (req, res) => {
  try {
    // جلب الفئات من الـ schema enum
    const categories = Product.schema.path('category').enumValues;
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ✅ إحصائيات الفئات (عدد المنتجات في كل فئة)
exports.GetCategoryStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    return res.status(200).json(stats);
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ✅ تعديل منتج
exports.UpdateProduct = async (req, res) => {
  try {
    if (req.file) {
      const product = await Product.findById(req.params.id);
      product.img = req.file.path;
      await product.save();
    }
    
    const { body } = req;
    await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    
    return res.status(202).send({ msg: "Update success" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};

// ✅ حذف منتج
exports.DeleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount == 0) {
      return res.status(400).send({ msg: "Bad request" });
    }
    return res.status(202).send({ msg: "product deleted" });
  } catch (error) {
    return res.status(503).send({ msg: error.message });
  }
};