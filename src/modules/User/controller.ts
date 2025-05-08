import baseController from "@/common/controllers/handlers";
import UserModel from "./model";

export const UserC = {
  ...baseController(UserModel),
};
export default UserC;
