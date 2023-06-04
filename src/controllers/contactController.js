import Contact from "../models/Contact.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import shortid from "shortid";

// Register User
export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    const isAlreadyPresent = await User.findOne({email});
    // console.log(isAlreadyPresent);
    if (isAlreadyPresent) {
      return res.status(500).send("Login User Already Exist");
    } 
    shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@");
    const id = await shortid.generate();

    console.log(User);
    const user = await User.create({
        id:id,
        email: email,
        password: hashedPassword,
    })
 
    return res.status(200).json({ message: "User Registered Successfully",data:user});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error });
    
  }
};

// Login User 
export const loginUser = async(req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    } 
    
      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) {
        return res.status(500).json({ message: "Password Incorrect" });
      } 
    
      const token =  jwt.sign({ id:"dfghjk" }, "secret", {
        expiresIn: "1h",
      }); 
         return res.status(200).json({ message: "User logged In", token: token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};


// verification of token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Create a new contact for the logged-in user
export const createContact = async (req, res) => {
    const {userId} = req.params;
  try {
    shortid.characters(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
    );
    const id = shortid.generate();
    const { name, phone } = req.body; 
    const contact = await Contact.create({
        id:id,
        userId:userId,
        name: name,
        phone: phone,
    });
    return res.status(200).json({ message: "Contact Created Successfully", data: contact });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

// Get all contacts for the logged-in user
export const getAllContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const contacts = await Contact.find({ userId });
    return res.status(200).json({ message: "All Contacts", data: contacts });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};

// Update an existing contact for the logged-in user
export const updateContact =async (req, res) => {
    const { userId,id } = req.params; 
  try {
    const foundProduct =await Contact.findOne({ userId: userId, id: id });
    if(req.body.name){ 
        (await foundProduct).name = req.body.name; 
    }
    if(req.body.phone){
      console.log(req.body.phone);
        (await foundProduct).phone = req.body.phone;
    }
    const updatedProduct =await Contact.create(foundProduct);
    return res.status(200).json({ message: "Contact Updated Successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

// Delete an existing contact for the logged-in user
export const deleteContact =async (req, res) => { 
  const { userId,id } = req.params;
  try {
    const foundProduct =await Contact.findOne({ userId: userId, id: id });
    const deletedProduct =await Contact.deleteOne(foundProduct);
    return res.status(200).json({ message: "Contact Deleted Successfully", data: deletedProduct });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error: error });
  }
};
 