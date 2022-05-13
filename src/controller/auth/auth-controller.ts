import { Request, Response } from "express"
import { validationResult } from "express-validator"

export function signup(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error: any = new Error("Validation failed")
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
  res.status(201).json({
    message: "User created successfully!!!",
  })
}
