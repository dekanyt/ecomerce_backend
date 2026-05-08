import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

//Function for the add product
// const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       subCategory,
//       sizes,
//       bestSeller,
//     } = req.body;

//     const image1 = req.files.image1 && req.files.image1[0];
//     const image2 = req.files.image2 && req.files.image2[0];
//     const image3 = req.files.image3 && req.files.image3[0];
//     const image4 = req.files.image4 && req.files.image4[0];

//     //we cannot store images directly in the database so thats why we need to store it first in the cloudinary and form there we get a url and we have to store that url and store that url in the database

//     const images = [image1, image2, image3, image4].filter(
//       (item) => item !== undefined
//     );
//     //for cloudinary
//     let imagesUrl = await Promise.all(
//       images.map(async (item) => {
//         let result = await cloudinary.uploader.upload(item.path, {
//           resource_type: "image",
//         }); // for doing this all the images are going to store in the cloudinary and the url of all those images are going to store in the imageUrl
//         return result.secure_url;
//       })
//     );

//     const productData = {
//       name,
//       description,
//       category,
//       price: Number(price),
//       subCategory,
//       bestSeller: bestSeller === "true" ? true : "false",
//       sizes: JSON.parse(sizes),
//       image: imagesUrl,
//       date: Date.now(),
//     };

//     console.log(productData);

//     const product = new productModel(productData);
//     await product.save();
//     res.json({
//       success: true,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
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

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch {
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

    await productModel.create(productData);

    res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Function for the list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Function for the remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed " });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Function for the single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
