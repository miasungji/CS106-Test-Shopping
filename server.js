
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); //JSON 파싱

//환경 변수에서 mongoDB 주소 가져오기
const MONGODB_URI = process.env.MONGODB_URI;

//mongoDB 연결 시도
mongoose.connect(MONGODB_URI)
    .then(() => console.log(` 🤖 MongoDB connected`))
    .catch(err => console.error(`👾MongoDB connection error`, err));

const Product = require('./models/Product'); //모델 불러오기

//mondoDB에 들어있는 데이터 가져와서 -> index.html에 보여주는 부분
app.get('/api/products', async (req, res) => {
    const items = await Product.find().sort({ _id: -1 }); //_id:-1 으로 할경우 내림차순 (제일 최근 업데이트 한게 맨 위로)
    res.json({ ok: true, items }); //index.js에 item 내용이 보이게 해주는 것
});


//라우트 추가
app.post('/api/products', async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.json({ ok: true, product: newProduct });
});

//삭제 기능
app.delete('/api/products/:id', async (req, res) => {
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);
    res.json({ ok: true, deleted });
});


//서버실행 (늘 마지막에 두기)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running: http://localhost ${PORT}`);
});




