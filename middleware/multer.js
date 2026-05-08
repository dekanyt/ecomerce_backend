// import multer from "multer";

// const storage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

// export default upload;

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = "uploads";

// // create uploads folder if not exists
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, uploadDir);
//   },
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// export default upload;


import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;