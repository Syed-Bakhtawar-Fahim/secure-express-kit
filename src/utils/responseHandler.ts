// src/utils/successResponse.ts
import { Response } from "express";

interface BaseResponse {
  success: boolean;
  message: string;
  statusCode: number;
  [key: string]: any;
}

export const sendResponse = (res: Response, response: BaseResponse) => {
  const { statusCode, ...rest } = response;
  return res.status(statusCode).json(rest);
};
