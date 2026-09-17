const express = require("express");
const {
  getUser,
  getWalletForUser,
  rotateWallet,
  getUserHistory,
  updateProfile,
  getRanking,
  deleteUser,
  searchFreelancers,
  updateCompanyProfile,
  requestVerification,
  getRecruiterProfile,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/jwt");
const router = express.Router();

router.get("/ranking", getRanking);
router.get("/search/freelancers", searchFreelancers);
router.get("/recruiter/:id", getRecruiterProfile);
router.put("/company-profile", verifyToken, updateCompanyProfile);
router.post("/request-verification", verifyToken, requestVerification);
router.get("/:publicKey", getUser);
router.get("/:publicKey/wallet", verifyToken, getWalletForUser);
router.post("/:publicKey/wallet/rotate", verifyToken, rotateWallet);
router.get("/:publicKey/history", getUserHistory);
router.patch("/:publicKey", verifyToken, updateProfile);
router.delete("/:publicKey", verifyToken, deleteUser);

module.exports = router;
