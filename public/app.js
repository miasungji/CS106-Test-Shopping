const $ = (sel) => document.querySelector(sel);
const statusBox = $('#status');
const listBox = $('#list');
const form = $('#product-form');
const submitBtn = $('#submit-btn');

// escapeHTML 
function escapeHtml(str = '') {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

const userInput = "<script>alert('XSS')</script>";
console.log(escapeHtml(userInput));

function setStatus(msg, type = 'info') {
    if (!statusBox) return;
    statusBox.textContent = msg || '';
    // 공백으로 클래스 분리 (status + 상태)
    const stateClass = type === 'ok' ? 'ok' : type === 'err' ? 'err' : 'muted';
    statusBox.className = `status ${stateClass}`;
}

// render list of items
function renderList(items) {
    if (!listBox) return;
    if (!Array.isArray(items) || items.length === 0) {
        listBox.innerHTML = '<div class="muted" style="padding:8px 0;">No items yet.</div>';
        return;
    }

    listBox.innerHTML = items.map(item => `
    <div class="row">
        <div>${escapeHtml(item?.name)}</div>
        <div>${escapeHtml(item?.category || '')}</div>
        <div>${Number.isFinite(Number(item?.price)) ? Number(item.price).toFixed(2) : ''}</div>
        <div>${Number.isFinite(Number(item?.quantity)) ? Number(item.quantity) : ''}</div>
    </div>
    `).join('');
}

// GET /api/market
async function loadList() {
    try {
        setStatus('Loading list...', 'info');
        const res = await fetch('/api/market');
        if (!res.ok) throw new Error(`Failed to load list (${res.status})`);
        const data = await res.json();
        renderList(data);
        setStatus('Loaded', 'ok');
    } catch (err) {
        console.error(err);
        setStatus(err.message || 'Error while loading list', 'err');
    }
}

// form 제출
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const nameEl = $('#name');
            const categoryEl = $('#category');
            const priceEl = $('#price');
            const quantityEl = $('#quantity');

            const name = nameEl?.value.trim();
            const category = categoryEl?.value.trim();
            const priceRaw = priceEl?.value ?? '';
            const qtyRaw = quantityEl?.value ?? '';

            // 공란 체크 + 숫자 유효성
            if (!name || priceRaw === '' || qtyRaw === '') {
                return setStatus('Please fill required fields.', 'err');
            }

            const price = Number(priceRaw);
            const quantity = Number(qtyRaw);

            if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
                return setStatus('Price and Quantity must be numbers.', 'err');
            }
            if (price < 0 || quantity < 0 || !Number.isInteger(quantity)) {
                return setStatus('Price >= 0, Quantity must be an integer >= 0.', 'err');
            }

            if (submitBtn) submitBtn.disabled = true;
            setStatus('Saving...', 'info');

            const res = await fetch('/api/market', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, category, price, quantity })
            });

            let body;
            try {
                body = await res.json();
            } catch (_) {
                body = null;
            }

            if (!res.ok) {
                const serverMsg = body?.error?.message || body?.message;
                throw new Error(serverMsg || `Failed to save (${res.status})`);
            }

            form.reset();
            await loadList();
            setStatus('Saved', 'ok');
        } catch (err) {
            console.error(err);
            setStatus(err.message || 'Error while saving', 'err');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
} else {
    console.warn('#product-form not found');
}

loadList();
