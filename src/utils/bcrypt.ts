import * as bcrypt from 'bcrypt';

// ==== REUSABLE COMPONENT TO ENCRYPT A STRING=======
export async function encryptString(rawString: string) {
  try {
    let hashedString = await bcrypt.hash(rawString, 10);
    return hashedString;
  } catch (err) {
    throw new Error(err.message);
  }
}

// ==== REUSABLE COMPONENT TO VALIDATE AN ENCRYPTED STRING=======
export async function validateEncrptedString(rawString: string,hashedString: string){
  try {
    let compare = await bcrypt.compare(rawString, hashedString);
    return compare;
  } catch (err) {
    throw new Error(err.message);
  }
}
