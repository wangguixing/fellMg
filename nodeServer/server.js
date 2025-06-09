const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")
const cors = require("cors")
const dayjs = require("dayjs")
const app = express()
const port = 12356

// 使用 body-parser 中间件解析 JSON 格式的数据
app.use(cors())
app.use(bodyParser.json())

// 处理 POST 请求
app.post("/api/data", (req, res) => {
  const data = req.body

  // 生成唯一的文件名
  const timestamp = dayjs().format("YYYY年MM月DD日HH时mm分ss秒")
  const fileName = `${timestamp}__${uuidv4()}.json`
  const filePath = path.join(__dirname, "data", fileName)

  // 确保数据目录存在
  if (!fs.existsSync(path.join(__dirname, "data"))) {
    fs.mkdirSync(path.join(__dirname, "data"))
  }

  // 将数据写入 JSON 文件
  fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error("Error writing file:", err)
      return res.status(500).send("Internal Server Error")
    }
    console.log(`Data saved to ${filePath}`)
    res.status(200).json({
      message: "Data received and stored successfully",
    })
  })
})

// 处理其他所有请求
app.all("*", (req, res) => {
  res.status(405).send("Method Not Allowed")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
