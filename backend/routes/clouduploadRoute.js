// upload images to local folder with (Multer)
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.post("/api/uploadpic",async(req,res)=>{
  console.log('file uploaded');
})
module.exports = router;
