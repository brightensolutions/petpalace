import jwt from "jsonwebtoken";
import crypto from "crypto";

export const CreateOneRecord = async (modelName: any, data: any) => {
  // console.log("Model:", modelName);
  const newRecord = new modelName(data);
  return await newRecord.save();
};

export const getAllRecords = async (modelName: any) => {
  try {
    const records = await modelName.find({}).sort({ createdAt: -1 });
    return records;
  } catch (error) {
    console.error("Error in getAllRecords:", error);
    throw error;
  }
};

export const getAllRecordswithcondition = async (
  modelName: any,
  filter: object = {}
) => {
  try {
    // console.log("Getting records from Model:", modelName, "with filter:", filter)
    const records = await modelName.find(filter).sort({ createdAt: -1 });
    return records;
  } catch (error) {
    console.error("Error in getAllRecords:", error);
    throw error;
  }
};

export const findOneRecord = async (modelName: any, query: any) => {
  try {
    const record = await modelName.findOne(query);
    if (!record) {
      // console.log("Record not found.")
      return null;
    }
    return record;
  } catch (error) {
    console.error("Error in findOneRecord:", error);
    throw new Error("Failed to find the record.");
  }
};

export const findOneAndUpdateRecord = async (
  modelName: any,
  query: any,
  payload: any,
  options: any = {}
) => {
  try {
    const updatedRecord = await modelName.findOneAndUpdate(query, payload, {
      new: true,
      upsert: true,
      ...options,
    });
    if (!updatedRecord) {
      throw new Error("Failed to find or update the record.");
    }
    return updatedRecord;
  } catch (error) {
    console.error("Error in findOneAndUpdateRecord:", error);
    throw new Error("Failed to find or update the record.");
  }
};

export function generateJwtToken(userId: string) {
  const secretKey =
    process.env.JWT_SECRET || "Kjsdf89*&^LKHfjsdkf9832@jdsfSDljfsdlf23489";
  return jwt.sign({ id: userId }, secretKey);
}

export function decodeJwtToken(token: string): { id: string } | null {
  try {
    const secretKey =
      process.env.JWT_SECRET || "Kjsdf89*&^LKHfjsdkf9832@jdsfSDljfsdlf23489";
    const decoded = jwt.verify(token, secretKey) as { id: string }; // Decode the token
    // console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:"); // Log the error
    return null;
  }
}

// Function to hash (encrypt) a password
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

// Function to verify (decrypt) a password
export function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
): boolean {
  const [salt, storedHash] = storedPassword.split(":");
  const hash = crypto
    .pbkdf2Sync(suppliedPassword, salt, 1000, 64, "sha512")
    .toString("hex");
  return storedHash === hash;
}

export const deleteMultipleRecords = async (
  modelName: any,
  filter: object = {}
) => {
  try {
    const result = await modelName.deleteMany(filter); // Delete records matching the filter
    if (result.deletedCount === 0) {
      // console.log("No records found to delete.");
    } else {
      // console.log(`${result.deletedCount} record(s) deleted successfully.`);
    }
    return result; // Return the result for additional processing or logging
  } catch (error) {
    console.error("Error in deleteMultipleRecords:", error);
    throw new Error("Failed to delete multiple records.");
  }
};
