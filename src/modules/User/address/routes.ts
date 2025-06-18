import express from "express";
import AddressC from "./controller";
import authMiddleware from "@/common/middleware/auth";
import validatorMiddleware from "@/common/middleware/validators/validator";
const addressR = express.Router();

// Get all addresses for the authenticated user
addressR.get(
  "/",
  authMiddleware(),
  AddressC.getAddresses.validator,
  validatorMiddleware,
  AddressC.getAddresses.handler
);

// Get a specific address by ID
addressR.get(
  "/:addressId",
  authMiddleware(),
  AddressC.getAddress.validator,
  AddressC.getAddress.handler
);

// Add a new address
addressR.post(
  "/",
  authMiddleware(),
  AddressC.addAddress.validator,
  validatorMiddleware,
  AddressC.addAddress.handler
);

// Remove an address
addressR.delete(
  "/:addressId",
  authMiddleware(),
  AddressC.removeAddress.validator,
  AddressC.removeAddress.handler
);

export default addressR;
