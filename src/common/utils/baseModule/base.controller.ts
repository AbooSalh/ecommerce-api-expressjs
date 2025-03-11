import { Request, Response } from "express";
import { BaseService } from "./base.service";
import expressAsyncHandler from "express-async-handler";
import ApiSuccess from "../api/ApiSuccess";

export class BaseController {
  protected service: BaseService;

  constructor(service: BaseService) {
    this.service = service;
  }

  getAll = {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const result = await this.service.findAll(page);
      ApiSuccess.send(res, "OK", "Data found", result);
    }),
    validator: [],
  };

  // getOne = asyncHandler(async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const data = await this.service.findById(id);
  //   if (!data) throw new ApiError("Not found", 404);
  //   res.json({ success: true, data });
  // });

  // create = asyncHandler(async (req: Request, res: Response) => {
  //   const data = await this.service.create(req.body);
  //   res.status(201).json({ success: true, data });
  // });

  // update = asyncHandler(async (req: Request, res: Response) => {
  //   const { id } = req.params;
  //   const data = await this.service.update(id, req.body);
  //   res.json({ success: true, data });
  // });

  // delete = asyncHandler(async (req: Request, res: Response) => {
  //   await this.service.delete(req.params.id);
  //   res.status(204).send();
  // });
}
