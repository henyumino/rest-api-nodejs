import { Session } from "inspector";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SchemaDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import {get} from 'lodash';
import { findUser } from "./user.service";
import config from 'config';  

export async function createSession(userId: string, userAgent: string){
  const session = await SessionModel.create({user: userId, userAgent})

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SchemaDocument>){
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SchemaDocument>, 
  update: UpdateQuery<SchemaDocument>){

  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({refreshToken}:{refreshToken: string}){
  const {decoded} = verifyJwt(refreshToken)

  if(!decoded || !get(decoded, "session")) return false

  const session = await SessionModel.findById(get(decoded, "session"))

  console.log({session})

  if(!session || !session.valid) return false

  const user = await findUser({_id: session.user})

  if(!user) return false

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 menit
  );

  return accessToken;
}