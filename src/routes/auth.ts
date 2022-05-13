import { Router } from "express"
import { signup } from "../controller/auth/auth-controller"
import { body } from "express-validator"

export const authRoutes = Router()

authRoutes.post(
  "/signup",
  body("email").isEmail().normalizeEmail(),
  body("userName")
    .isLength({ min: 5, max: 10 })
    .withMessage("must be at least 5 and at most 10 chars long"),
  body("country")
    .isLength({ min: 2, max: 2 })
    .withMessage("must be iso2 code for country"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long")
    .matches(/\d/)
    .withMessage("must contain a number"),
  signup
)
