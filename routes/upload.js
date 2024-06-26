const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const fs = require("fs");
const dataService = require("../database/service");
var express = require("express");
var router = express.Router();

router.post("/", upload.array("files"), async function (req, res, next) {
  try {
    const files = req.files;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const bucketName = "pink-panthers-assignment";
    Promise.all(
      await files.map(async (file) => {
        const filePath = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(file.filename, filePath);
        if (error) {
          console.error("Error uploading file:", error.message);
          return res
            .status(500)
            .json({ message: "File upload failed", error: error.message });
        }
        fs.unlinkSync(file.path);
        const result = await supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);
        return { ...file, ...data, publicUrl: result.data.publicUrl };
      })
    ).then((results) => {
      dataService.cleanUpDir();
      res
        .status(200)
        .json({ message: "File uploaded successfully", files: results });
    });
  } catch (error) {
    console.error("Error handling file upload:", error.message);
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});
module.exports = router;
