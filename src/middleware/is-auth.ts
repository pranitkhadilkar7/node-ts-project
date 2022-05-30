import { NextFunction, Response, Request } from "express"
import { verify } from "jsonwebtoken"

export function isAuth(
  req: Request & { userId?: number },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    const error: any = new Error("Not Authorized")
    error.statusCode = 401
    throw error
  }
  const token = authHeader.split(" ")[1]
  let decodedToken: any
  try {
    decodedToken = verify(token, "pranitkhadilkar")
  } catch (err: any) {
    err.statusCode = 500
    throw err
  }
  if (!decodedToken) {
    const error: any = new Error("Not Authorized")
    error.statusCode = 401
    throw error
  }
  req.userId = decodedToken["userId"]
  next()
}
