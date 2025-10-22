// document.getElementById('send').addEventListener('click', () => {
//     //물건 집어 넣기 
//     fetch('http://localhost:3000/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             name: 'Vintage dress',
//             price: 21.9,
//             stock: 10,
//             category: 'dress',
//             description: 'Classic retro design dress',
//             image: 'https://example.com/dress.jpg'
//         })
//     })
//         .then(res => res.json())
//         .then(data => console.log(data))
//         .catch(err => console.log(err));
// });

//보여주기

const productsShow = document.getElementById('products'); //보여주기
const form = document.getElementById('productForm'); //인풋박스들


//보여주기
fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    .then(data => {
        const items = data.items || [];
        const html = items.map(p => `
            <div>
            <h3>${p.name}</h3>
            <p>Price: $${p.price}</p>
            <p>Stock: ${p.stock}</p>
            <p>${p.description}</p>
            <button class="delete-btn" data-id = "${p._id}">DELETE</button>
            <hr>
        </div>
            `).join('');

        productsShow.innerHTML = html;

        productsShow.innerHTML += `
        <p>first product: ${items[0].name}</p>
        `
    });

//폼 제출하기 (새로 추가하기)
form.addEventListener('submit', (e) => {
    e.preventDefault(); //폼 제출 후 새로고침 방지

    //폼 데이터 읽어오기
    const newProduct = {
        name: document.getElementById('name').value.trim(),
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value.trim(),
        image: document.getElementById('image').value.trim(),
        description: document.getElementById('description').value.trim()
    };


    //POST 요청 보내기
    fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    })
        .then(res => res.json())
        .then(data => {
            console.log('saved', data);

            //저장 후 목록 다시 불러오기
            return fetch('http://localhost:3000/api/products');
        })
        .then(res => res.json())
        .then(data => {
            const items = data.items || [];
            const html = items.map(p => `
        <div>
                    <h3>${p.name}</h3>
                    <p>Price: $${p.price}</p>
                    <p>Stock: ${p.stock}</p>
                    <p>${p.description}</p>
                    <hr>
                </div>
        `).join('');
            productsShow.innerHTML = html;


            //첫번째 상품 표시 
            productsShow.innerHTML += items.length > 0
                ? `<p>first product: ${items[0].name}</p>`
                : `<p>first product: (no items)</p>`;


            form.reset();
        });
});

//삭제하기
productsShow.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-btn');
    const id = btn.dataset.id; //버튼에 심어둔 몽고디비 아이디

    fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            return fetch('http://localhost:3000/api/products');
        })
        .then(res => res.json)
        .then(data => {
            const items = data.items || [];
            const html = items.map(p => `
        <div>
            <h3>${p.name}</h3>
            <p>Price: $${p.price}</p>
            <p>Stock: ${p.stock}</p>
            <p>${p.description}</p>
            <button class="delete-btn" data-id="${p._id}">DELETE</button>
            <hr>
            </div>
        `).join('');
            productsShow.innerHTML = html;
        })

})


