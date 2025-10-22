const mongoose = require('mongoose');

//1. 상품구조 (스키마) 정의
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },      // 상품 이름 (필수)
    price: { type: Number, required: true },     // 가격 (필수)
    stock: { type: Number, default: 0 },         // 재고 (기본값 0)
    category: { type: String },                  // 카테고리
    description: { type: String },               // 상세 설명
    image: { type: String },                     // 이미지 URL
    createdAt: { type: Date, default: Date.now } // 생성 시각 자동 저장
});

//2. 이 스키마를 가진 모델 만들기 
// 'Product; --> 몽고디비에서는 자동으로 Products 라는 컬렉션이 만들어짐
const Product = mongoose.model('Product', productSchema);

//3. 다른 파일에서도 사용할 수 있게 내보내기
module.exports = Product;