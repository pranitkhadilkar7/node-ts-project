import express from "express"
import bodyParser from "body-parser"
import { authRoutes } from "./routes/auth"
import { sequelize } from "./utils/database"

const app = express()

const port = 8080

app.use(bodyParser.json())

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  next()
})

app.use("/auth", authRoutes)

app.use((error: any, req: any, res: any, next: any) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message, data })
})

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
