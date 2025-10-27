import express from "express";
import { createApplicant, getUserByAadhaar, getUserAdharPhoto, getUserByAadhar, deleteUserByAadhar, getUserByName, updateUserByUID, getUserCount, pagination, userActivity, filterByHandicapType, getBiometricIdByUID, getAllUsers } from "../controllers/userController.js";

//Router object
const userRoutes = express.Router();

//User routes
userRoutes.post("/createUser/:applicantAadhar", createApplicant);
userRoutes.get("/getDataByUID", getUserByAadhaar);
userRoutes.get("/getAllUsers", getAllUsers);
userRoutes.get("/getAdharPhoto", getUserAdharPhoto);
userRoutes.get("/searchByUID", getUserByAadhar);
userRoutes.get("/getUserByName", getUserByName);
userRoutes.get("/getUserCount", getUserCount);
userRoutes.get("/pagination", pagination);
userRoutes.get("/filterByHandicapType", filterByHandicapType);
userRoutes.get("/userActivity", userActivity);
userRoutes.get("/getBiometricIdByUID", getBiometricIdByUID);
userRoutes.patch("/updateUserByUID", updateUserByUID);
userRoutes.delete("/deleteUserByUID", deleteUserByAadhar);

export default userRoutes;

