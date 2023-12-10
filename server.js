const express = require("express");
const fs = require("fs").promises;
const pathUtil = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4 } = require("uuid");

const hostName = "127.0.0.1";
const port = 4444;

const app = express();

const postImagePath = pathUtil.join('public', 'images', 'post');
const localPostImagePath = pathUtil.join(__dirname, postImagePath);

app.use(express.static("public"));
app.use(cors({origin:"https://post-react.onrender.com"}));
app.use(bodyParser.json({
  limit:"50mb"
}));
app.use(bodyParser.urlencoded({
  limit:"50mb",
  extended:false
}))


// 경로/uuid로 파일 저장 후, path, file_name, post_id 로 insert
// 경로/images/post/uuid.확장자로 저장 후, 경로 반환.
app.post("/save", (req, res) => {
  // console.log(req.body);

  saveImage(localPostImagePath, req.body.file, req.body.type)
  .then((result)=>{
    res.setHeader("Access-Control-Allow-Origin","https://post-react.onrender.com")
    res.send(`http://${hostName}:${port}/images/post/${result}`);
  })
});

app.listen(port, () => {
  console.log(`==== Server is running : http://${hostName}:${port}`);
});

async function saveImage(path, data, type) {
  const fileName = `${v4()}.${type}`;
  const filePath = pathUtil.join(path, fileName);
  const base64Img = data.split(';base64,').pop();

  await fs.writeFile(filePath, base64Img, {encoding:'base64'},(err) => {
    console.log(err);
  });
  return fileName;
}
