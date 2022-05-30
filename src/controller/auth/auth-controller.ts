import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import { User } from "../../modal/user"
import { SignupData } from "./auth-type"
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

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

export function login(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email
  const password = req.body.password
  let loadedUser: any
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user: any) => {
      if (!user) {
        const error: any = new Error(
          "A user with this email could not be found"
        )
        error.statusCode = 401
        throw error
      }
      loadedUser = user
      return compare(password, loadedUser.password)
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error: any = new Error("Wrong Password!")
        error.statusCode = 401
        throw error
      }
      const token = sign(
        { email: loadedUser.email, userId: loadedUser.id },
        "pranitkhadilkar",
        { expiresIn: "1h" }
      )
      res.status(200).json({ token, userId: loadedUser.id })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}
