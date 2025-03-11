import { BaseController } from "@/common/utils/baseModule/base.controller";
import subCategoryService from "./services";

class SubCategoryController extends BaseController {
  constructor() {
    super(subCategoryService);
  }
}

const subCategoryController = new SubCategoryController();
export default subCategoryController;
