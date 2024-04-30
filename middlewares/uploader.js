const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, "./uploads");
  },
  filename: (req, file, done) => {
    const fileExtension = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExtension, "")
        .toLocaleLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now()+
    fileExtension;
    done(null, fileName);
  },
});

const uploader = multer({
  
  storage: storage,
  limits: {
    fileSize: 7000000,
  },
  fileFilter: (req, file, done) => {
    const fileName = file.mimetype;
    if (
      fileName === "image/png" ||
      fileName === "image/jpg" ||
      fileName === "image/jpeg"
    ) {
      done(null, true);
    } else {
      done(new Error("Invalid file type", false));
    }
  },
});

module.exports = uploader;
