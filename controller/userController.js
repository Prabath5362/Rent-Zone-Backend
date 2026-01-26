import bcrypt from "bcrypt";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import e from "cors";


dotenv.config();


export function isAdmin(req) {
  if (req.user.role == "admin") {
    return true;
  } else {
    return false;
  }
}

export function isUser(req) {
  if (req.user.role == "customer") {
    return true;
  } else {
    return false;
  }
}

export function isUserNull(req) {
  if (req.user == null) {
    return true;
  } else {
    return false;
  }
}


export async function registerUser(req, res) {
  try {
    const userData = req.body;

    const existUser = await User.findOne({
      "email": userData.email
    });
    if(existUser != null){
      res.status(400).json({
        message: "User alrady exist, Please Login",
        error: true
      });
    }

    userData.password = bcrypt.hashSync(userData.password, 10);
    const user = new User(userData);
    await user.save();
    res.json({
      message: "Registration success",
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Registration failed",
      error: true,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const userData = req.body;
    const user = await User.findOne({
      email: userData.email,
    });

    if (user == null) {
      res.status(400).json({
        message: "User not found",
        error: true
      });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(
      userData.password,
      user.password
    );

    if (isPasswordValid) {
      const tokenData = {
        "id": user._id,
        "email": user.email,
        "role": user.role,
        
      };
      const token = jwt.sign(tokenData, process.env.SACHIN_JWT);
      res.json({
        message: "Login success",
        token: token,
        error: false
      });
    } else {
      res.status(400).json({
        message: "Password not match",
        error: true
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Login error !",
      error: true
    });
  }
}

export async function getUserDetails(req, res) {
  try {
    if(isUserNull(req)){
        res.status(400).json({
            message: "You are not authorized to perform this task",
            error: true
        });
        return;
    }

    const userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.json({
      user: user,
      error: false,
      message: "User details fetched successfully"
    });

  
  } catch (e) {
    res.status(500).json({
      message: "Error fetch user details !",
      error: true
    });
  }
}

export async function updateUser(req, res) {
  try {
    if (isUserNull(req)) {
    res.status(400).json({
      message: "You are not authorized to perform this task",
      error: true
    });
    return;
  }

  if (isUser(req)) {
    const updateData = req.body;
    if (updateData.password != null && updateData.password !== "") {
      updateData.password = bcrypt.hashSync(updateData.password, 10);
    }
    
    if(!isAdmin(req)){
        updateData.role = "customer";
    }
    const updateID = updateData.email;
    await User.updateOne(
      {
        email: updateID,
      },
        updateData
    );
    
    res.json({
      message: "User updated successfully",
      error: false
    });
  }
  }catch(e){
    res.status(500).json({
      message: "User updating failed !",
      error: true
    })
  }
}



export async function getAllUsers(req,res) {
  try{
    if(isUserNull(req)){
        res.status(400).json({
            message: "You are not authorized to perform this task",
            error: true
        });
        return;
    }

    if(!isAdmin(req)){
        res.status(400).json({
            message: "You are not authorized to perform this task",
            error: true
        });
        return;
    }

    const users = await User.find({
        role: "customer"
    });
    res.json({
      users: users,
      error: false,
      message: "Users fetched successfully"
    });
  } catch (e) {
    res.status(500).json({
      message: "Error fetching users ",
      error: true
    });
  }
}


export async function deleteUser(req,res) {
  try {
    if (isUserNull(req)) {
      res.status(400).json({
        message: "You are not authorized to perform this task",
      });
      return;
    }

    if(!isAdmin(req)){
        res.status(400).json({
            message: "You are not authorized to perform this task"
        });
        return;
    }

    const deleteId = req.params.email;
    await User.deleteOne({
      email: deleteId,
    });

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting user" ,
    });
  }
}