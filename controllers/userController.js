import asyncHandler from "express-async-handler";
import User from "../models/userSchema.js";

//Create applicant -Done
export const createApplicant = asyncHandler(async (req, res) => {
  const aadharID = req.params.applicantAadhar;
  const applicantData = await User.create(req.body);
  try {
    if (aadharID !== applicantData.applicantAadhar) {
      res.status(400).json({ message: "Enter valid adhar number" });
    } else {
      res.status(200).json({
        message: "Applicant created sucessfully",
        data: applicantData,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//  Get user by Aadhaar number -Done
export const getUserByAadhaar = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({
      requestedAadhaar: req.body.applicantAadhar,
    });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User fetched sucessfully", data: user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//Get user Adhar Photo -Done
export const getUserAdharPhoto = asyncHandler(async (req, res) => {
  try {
    const { applicantAadhar } = req.body;
    const user = await User.findOne({ applicantAadhar });

    if (!user) {
      return res.status(400).json({ message: "Enter a valid Aadhar number" });
    }
    res.status(200).json({
      message: "User Aadhar photo fetched successfully",
      data: {
        aadharFront: user.aadharFront_link,
        aadharBack: user.aadharBack_link,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get user by Aadhar -Done
export const getUserByAadhar = asyncHandler(async (req, res) => {
  try {
    const querryUID = req.body.applicantAadhar;
    if (!querryUID) {
      return res.status(400).json({ message: "Please provide adhar number" });
    }
    const regex = new RegExp(querryUID); //match UIDs for partial search
    const users = await User.find({ applicantAadhar: regex });
    if (users.length === 0) {
      res.status(404).json({ message: "No user found" });
    } else {
      res
        .status(200)
        .json({ message: "Users fetched sucessfully", data: users });
      // console.log(users);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: " Something went wrong ", error: error.message });
  }
});

//Delete user by Aadhar number -Done
export const deleteUserByAadhar = asyncHandler(async (req, res) => {
  const user = await User.findOneAndDelete({
    applicantAadhar: req.body.applicantAadhar,
  });
  try {
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    } else {
      res.status(200).json({ message: "User deleted sucessfully" });
      // console.log(`${user.username} deleted sucessfully`);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//Get user by Name
export const getUserByName = asyncHandler(async (req, res) => {
  try {
    const querryName = req.body.username;
    const regex = new RegExp(querryName, "i"); //matches names partially in DB
    const users = await User.find({ username: regex });
    if (users.length === 0) {
      res.status(404).json({ message: "No user found" });
    } else {
      res
        .status(200)
        .json({ message: "users fetched sucessfully", data: users });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//Update user by UID
export const updateUserByUID = asyncHandler(async (req, res) => {
  try {
    const { applicantAadhar } = req.body;
    if (!applicantAadhar) {
      return res
        .status(400)
        .json({ message: "Please provide valid aadhar number" });
    }
    const user = await User.findOneAndUpdate({ applicantAadhar }, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    } else {
      res.status(200).json({ message: "User updated succesfully", data: user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//Get user count
export const getUserCount = asyncHandler(async (req, res) => {
  try {
    const userCount = await User.find().countDocuments();
    res
      .status(200)
      .json({ message: "User count fetched sucessfully", data: userCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//Pagination for UDID search
export const pagination = asyncHandler(async (req, res) => {
  try {
    const querryUID = req.query.applicantAadhar;
    if (!querryUID) {
      return res.status(400).json({ message: "Please provide Aadhaar number" });
    }

    // Pagination query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const regex = new RegExp(querryUID); // Partial search
    const totalResults = await User.countDocuments({ applicantAadhar: regex });

    if (totalResults === 0) {
      return res.status(404).json({ message: "No user found" });
    }

    const users = await User.find({ applicantAadhar: regex })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalResults / limit);

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      meta: {
        page,
        limit,
        totalResults,
        totalPages,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//User activity log
export const userActivity = asyncHandler(async (req, res) => {
  try {
    const { applicantAadhar } = req.body;
    if (!applicantAadhar) {
      return res.status(400).json({ message: "Please provide Aadhar number" });
    }
    const activities = await User.findOne(
      { applicantAadhar },
      "username applicantAadhar createdAt updatedAt"
    );
    res.status(200).json({
      message: "User activities fetched successfully",
      data: activities,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//Sort/filter users by handicap type
export const filterByHandicapType = asyncHandler(async (req, res) => {
  try {
    const { handicapType } = req.body;
    if (!handicapType) {
      return res.status(400).json({ message: "Please enter handicap type" });
    } else {
      const users = await User.find({ handicapType });
      if (users.length === 0) {
        return res
          .status(404)
          .json({ message: "No users found for this handicap type" });
      } else {
        res
          .status(200)
          .json({ message: "Users fetch sucessfully", data: users });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//get biometricId by UID
export const getBiometricIdByUID = asyncHandler(async(req, res) => {
  try {
    const { applicantAadhar } = req.body;
    const user = await User.findOne({ applicantAadhar });
    if (!applicantAadhar) {
      return res.status(400).json({ message: " Please provide valid Aadhar number "});
    } else {
      res.status(200).json({
        message: "Biometric ID fetched sucessfully", data: user.biometricId
      });
    }
  } catch (error) { 
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

//Get count of all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({
      message: "User count fetched successfully",
      data: userCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});
