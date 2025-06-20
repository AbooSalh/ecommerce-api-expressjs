import { IUser, IUserAddress } from "../User/model";
import ApiError from "@/common/utils/api/ApiError";

/**
 * Returns the shipping address for a user, given an optional addressId.
 * Throws ApiError if not found.
 */
export function getShippingAddress(
  user: IUser,
  addressId?: string
): IUserAddress {
  if (!user) throw new ApiError("User not found", "NOT_FOUND");
  if (addressId) {
    const found = user.addresses?.find(
      (addr: IUserAddress) => addr._id.toString() === addressId.toString()
    );
    if (!found) throw new ApiError("Address not found", "NOT_FOUND");
    return found;
  }
  const def = user.addresses?.find((addr: IUserAddress) => addr.isDefault);
  if (!def) throw new ApiError("No default address found", "NOT_FOUND");
  return def;
}
