import express from "express";
import { Router } from "express";
import {
  verifyToken,
  registerUser,
  loginUser,
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

const router = Router();

// Register a new user
router.post("/register", registerUser);

// Login a registered user
router.post("/login", loginUser);

// Get all contacts for the logged-in user
router.get("/:userId/getallcontacts", verifyToken, getAllContacts);

// Create a new contact for the logged-in user
router.post("/:userId/createcontact", verifyToken, createContact);

// Update an existing contact for the logged-in user
router.put("/:userId/updatecontact/:id", verifyToken, updateContact);

// Delete an existing contact for the logged-in user
router.delete("/:userId/deletecontact/:id", verifyToken, deleteContact);

export default router;
