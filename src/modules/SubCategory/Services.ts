import { BaseService } from "@/common/utils/baseModule/base.service";
import SubCategoryModel from "./model";

class SubCategoryService extends BaseService {
  constructor() {
    super(SubCategoryModel);
  }
}

const subCategoryService = new SubCategoryService();
export default subCategoryService;
