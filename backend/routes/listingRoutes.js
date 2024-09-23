const express = require("express");
const { authenticateToken } = require("../middleware/authenticationToken");
const { createListing, getListing, deleteListing, getListingById, updateListing, getSearchListing } = require("../controllers/listingController");
const router = express.Router();

router.post("/create-listing",authenticateToken,createListing);
router.get("/get-listing/:id",authenticateToken,getListing);
router.delete("/delete/:id",authenticateToken,deleteListing);
router.get("/get-single-listing/:id",authenticateToken,getListingById);
router.patch("/update/:id",authenticateToken,updateListing)
router.get("/search",getSearchListing)
module.exports = router;