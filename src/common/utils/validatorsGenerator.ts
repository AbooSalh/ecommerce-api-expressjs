/* eslint-disable @typescript-eslint/no-explicit-any */
import { body, ValidationChain } from "express-validator";
import { Model } from "mongoose";

export default function generateValidator(
  model: Model<any>,
  excludeFields: string[] = []
): ValidationChain[] {
  const schemaPaths = model.schema.paths;
  const validators: ValidationChain[] = [];

  console.log("🧪 Generating validators for model:", model.modelName);
  console.log("🚫 Excluded fields:", excludeFields);

  for (const key in schemaPaths) {
    if (
      excludeFields.includes(key) ||
      key === "__v" ||
      key === "_id" ||
      key.includes(".")
    ) {
      console.log(`⚠️ Skipping field: ${key}`);
      continue;
    }

    const path = schemaPaths[key];
    console.log(`✅ Adding validator for: ${key}, type: ${path.instance}`);

    let validator = body(key);

    if (path.isRequired) {
      validator = validator.notEmpty().withMessage(`${key} is required`);
      console.log(`   🔒 Required: ${key}`);
    }

    switch (path.instance) {
      case "String":
        validator = validator.isString().withMessage(`${key} must be a string`);
        break;
      case "Number":
        validator = validator
          .isNumeric()
          .withMessage(`${key} must be a number`);
        break;
      case "Boolean":
        validator = validator
          .isBoolean()
          .withMessage(`${key} must be true/false`);
        break;
      case "ObjectID":
        validator = validator
          .isMongoId()
          .withMessage(`${key} must be a valid Mongo ID`);
        break;
      default:
        console.log(`   ❓ Unhandled type for: ${key} (${path.instance})`);
    }

    validators.push(validator);
  }

  console.log(`✅ Total validators generated: ${validators.length}`);
  return validators;
}
