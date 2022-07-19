import { Request, Response } from "express";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validasi password user

  const user = await validatePassword(req.body)
  if (!user) {
    return res.status(401).send("invalid email or password")
  }
  // membuat session
  const session = await createSession(user._id, req.get("user-agent") || "")
  // membuat akses token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 menit
  );

  // membuat refresh akses token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 15 menit
  );
  // return akses dan refresh token
  res.cookie("accessToken", accessToken, {
    maxAge: 900000, // 15 mnt
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1 thn
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response){
  const userId = res.locals.user._id
  console.log(userId)
  const sessions = await findSessions({ user: userId, valid: true})
  console.log({sessions})
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response){
  const sessionId = res.locals.user.session;

  await updateSession({_id: sessionId}, {valid: false});

  return res.send({
    accessToken: null,
    refreshToken: null
  })
}