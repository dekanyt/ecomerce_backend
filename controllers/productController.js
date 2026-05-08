import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import streamifier from "streamifier";

// upload image from buffer to cloudinary
const uploadFromBuffer = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "Images are required",
      });
    }

    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // upload images to cloudinary using buffer
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await uploadFromBuffer(item.buffer);
        return result.secure_url;
      }),
    );

    let parsedSizes = [];

    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid sizes format",
      });
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Function for remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Product Removed",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Function for single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
