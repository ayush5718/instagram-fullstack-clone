import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../config/datauri.js";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";

// controller for registering the user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(401).json({
        message: "Username already exists, try a different username!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists, please login!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong, please try again!",
      success: false,
    });
  }
};

// controller to login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password !",
        success: false,
      });
    }

    const isPassswordMatch = await bcrypt.compare(password, user.password);
    if (!isPassswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password !",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {}
};

// controller to logout
export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// controller to get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks")
      .select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// controller to update or edit profile by loggedin user
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender, username } = req.body;
    const profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(401).json({
        message: "Username already exists, try a different username!",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (username) user.username = username;

    if (gender) user.gender = gender;

    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
// get suggested user controlller

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(404).json({
        message: "No user found",
        success: false,
      });
    }

    return res.status(200).json({
      suggestedUsers,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// controller to follow or unfollow user
export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id; // jo follow krega
    const jiskoFollowKarunga = req.params.id; // jisko follow karna hai

    if (followKrneWala === jiskoFollowKarunga) {
      return res.status(401).json({
        message: "You can't follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const followingUser = await User.findById(jiskoFollowKarunga);

    if (!followingUser || !user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // now we will check either the user will follow or unfollow
    const isFollowing = user.following.includes(jiskoFollowKarunga);
    if (isFollowing) {
      // user will unfollow

      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "User unfollowed successfully",
        success: true,
      });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);

      return res.status(200).json({
        message: "User followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
