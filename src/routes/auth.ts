import { Router } from "express"
import { signup } from "../controller/auth/auth-controller"
import { body } from "express-validator"
import { User } from "../modal/user"

export const authRoutes = Router()

authRoutes.post(
  "/signup",
  body("email")
    .isEmail()
    .custom((value) => {
      return User.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-Mail already exists!!")
        }
      })
    })
    .normalizeEmail(),
  body("username")
    .isLength({ min: 5, max: 10 })
    .withMessage("must be at least 5 and at most 10 chars long"),
  body("country")
    .isLength({ min: 2, max: 2 })
    .withMessage("must be iso2 code for country"),
  body("password")
    .exists()
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long")
    .matches(/\d/)
    .withMessage("must contain a number"),
  signup
)
