import { DecodedIdToken } from "firebase-admin/auth";
import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
    user: DecodedIdToken;
}
