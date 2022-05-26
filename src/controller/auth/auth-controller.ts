import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { User } from "../../modal/user"
import { SignupData } from "./auth-type"
import { hash } from "bcryptjs"

export function signup(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  const { email, username, country, password } = req.body as SignupData
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed")
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
  hash(password, 12)
    .then((hashedPwd) => {
      return User.create({ email, username, country, password: hashedPwd })
    })
    .then((user) => {
      console.log("user", user)
      if (user) {
        res.status(201).json({
          message: "User created successfully!!!",
          user,
        })
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
