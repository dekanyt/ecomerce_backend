//we use this in case of those api where admin need to do somthing

// import jwt from "jsonwebtoken";

// const adminAuth = async (req, res, next) => {
//   try {
//     const { token } = req.headers;
//     if (!token) {
//       return res.json({
//         success: false,
//         message: "Not Authorized login Again",
//       });
//     }
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//       return res.json({
//         success: false,
//         message: "Not Authorized login Again",
//       });
//       next();
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export default adminAuth;


// we use this in case of those api where admin need to do something

import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized login Again",
      });
    }

    // decode token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // token_decode must contain the admin string
    if (
      token_decode !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Not Authorized login Again",
      });
    }

    // ✅ VERY IMPORTANT
    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default adminAuth;
