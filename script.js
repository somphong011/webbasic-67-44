// 1. กำหนดตัวแปรส่วนกลาง
let user = null;
let cart = [];
let currentItem = { name: "", price: 0 };

// 2. ฟังก์ชันควบคุมการเปิด-ปิด Modal
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}

// 3. เชื่อมต่อระบบ Login
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault(); // ป้องกันหน้าเว็บรีโหลด
    
    const inputName = document.getElementById('nickName').value;
    const inputPhone = document.getElementById('phone').value;

    if (inputName && inputPhone) {
        user = inputName; // บันทึกชื่อผู้ใช้
        document.getElementById('userBtn').innerText = "สวัสดีคุณ " + user;
        document.getElementById('userBtn').style.color = "#27ae60"; // เปลี่ยนสีให้รู้ว่าล็อกอินแล้ว
        closeModals();
        console.log("Login Success:", user);
    }
};

// 4. ฟังก์ชันเริ่มสั่งอาหาร (Check Login ก่อนสั่ง)
function startOrder(name, price) {
    if (!user) {
        alert("กรุณาเข้าสู่ระบบก่อนเลือกเมนูนะครับ");
        openModal('loginModal');
        return;
    }
    
    // บันทึกค่าเมนูที่เลือกปัจจุบัน
    currentItem = { name: name, price: price };
    
    // แสดงชื่อเมนูบน Modal
    document.getElementById('displayMenuName').innerText = name;
    
    // ล้างค่า Checkbox เก่า (ถ้ามี)
    document.querySelectorAll('#orderModal input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    openModal('orderModal');
}

// 5. ฟังก์ชันเพิ่มของลงตะกร้า
function addToCart() {
    // ดึงค่ารูปแบบการเสิร์ฟ (คลุก/แยก)
    const type = document.querySelector('input[name="serveType"]:checked').value;
    
    // ดึงค่าท็อปปิ้ง
    const toppings = Array.from(document.querySelectorAll('#toppingList input:checked')).map(el => el.value);
    
    // ดึงค่าของแถมฟรี
    const extras = [];
    if(document.getElementById('addSoup').checked) extras.push("น้ำซุป");
    if(document.getElementById('addSpoon').checked) extras.push("ช้อน-ส้อม");
    if(document.getElementById('addChili').checked) extras.push("พริกน้ำปลา");

    // คำนวณราคาทั้งหมด (ค่าอาหาร + ท็อปปิ้งอย่างละ 15)
    const toppingTotal = toppings.length * 15;
    const finalPrice = currentItem.price + toppingTotal;

    // สร้างก้อนข้อมูลสินค้า
    const orderEntry = {
        name: currentItem.name,
        type: type,
        toppings: toppings,
        extras: extras,
        price: finalPrice
    };

    // ใส่ตะกร้าและอัปเดตหน้าจอ
    cart.push(orderEntry);
    updateCartUI();
    closeModals();
    openModal('cartModal'); // สั่งเสร็จเด้งไปหน้าตะกร้าให้ผู้ขายดูทันที
}

// 6. ฟังก์ชันอัปเดตหน้าตะกร้า (Cart)
function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const countSpan = document.getElementById('cartCount');
    const totalDiv = document.getElementById('cartTotal');
    
    countSpan.innerText = cart.length;
    container.innerHTML = "";
    
    let totalAll = 0;

    cart.forEach((item, index) => {
        totalAll += item.price;
        const itemHtml = `
            <div class="cart-item" style="background: #fff; border: 1px solid #eee; padding: 10px; border-radius: 10px; margin-bottom: 10px; position: relative;">
                <span onclick="removeFromCart(${index})" style="position: absolute; right: 10px; top: 10px; color: red; cursor: pointer; font-size: 0.8rem;">ลบ</span>
                <div style="font-weight: bold; color: #d35400;">${index + 1}. ${item.name}</div>
                <div style="font-size: 0.85rem; color: #666;">
                    • การเสิร์ฟ: ${item.type}<br>
                    • ท็อปปิ้ง: ${item.toppings.length > 0 ? item.toppings.join(', ') : 'ปกติ'}<br>
                    • เพิ่มเติม: ${item.extras.length > 0 ? item.extras.join(', ') : '-'}
                </div>
                <div style="text-align: right; font-weight: bold;">฿${item.price}</div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    totalDiv.innerText = `ยอดรวมทั้งหมด: ฿${totalAll}`;
}

// 7. ฟังก์ชันลบสินค้า
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ปิด Modal เมื่อคลิกพื้นที่ว่าง
window.onclick = function(event) {
    if (event.target.className === 'modal-overlay') closeModals();
};

// อัปเดตการแสดงผลในตะกร้า (เพิ่มชื่อผู้สั่ง)
function updateCartUI() {
    const container = document.getElementById('cartItemsContainer');
    const countSpan = document.getElementById('cartCount');
    const totalDiv = document.getElementById('cartTotal');
    
    // ดึงค่าเบอร์โทรจาก input (ถ้าต้องการโชว์คู่กับชื่อ)
    const userPhone = document.getElementById('phone').value;
    
    countSpan.innerText = cart.length;
    container.innerHTML = "";
    
    // 1. ส่วนหัวตะกร้า: แสดงชื่อลูกค้าและเบอร์โทร (สำหรับผู้ขายดู)
    const customerInfo = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 10px; border: 1px dashed #d35400; margin-bottom: 20px;">
            <div style="font-size: 0.9rem; color: #856404;">👤 ผู้สั่งอาหาร:</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #d35400;">คุณ ${user}</div>
            <div style="font-size: 1rem; color: #555;">📞 เบอร์โทร: ${userPhone}</div>
        </div>
        <div style="margin-bottom: 10px; font-weight: 500; border-bottom: 2px solid #eee;">รายการที่สั่ง:</div>
    `;
    container.innerHTML = customerInfo;

    let totalAll = 0;

    // 2. รายการสินค้า
    cart.forEach((item, index) => {
        totalAll += item.price;
        const itemHtml = `
            <div class="cart-item" style="background: #fff; border: 1px solid #eee; padding: 12px; border-radius: 10px; margin-bottom: 10px; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <span onclick="removeFromCart(${index})" style="position: absolute; right: 10px; top: 10px; color: #ff4d4d; cursor: pointer; font-size: 0.8rem; font-weight:bold;">[ลบ]</span>
                <div style="font-weight: bold; color: #333; font-size: 1.1rem;">${index + 1}. ${item.name}</div>
                <div style="font-size: 0.9rem; color: #666; margin: 5px 0;">
                    • เสิร์ฟแบบ: <b>${item.type}</b><br>
                    • ท็อปปิ้ง: ${item.toppings.length > 0 ? item.toppings.join(', ') : 'ปกติ'}<br>
                    • รับเพิ่ม: ${item.extras.length > 0 ? item.extras.join(', ') : '-'}
                </div>
                <div style="text-align: right; font-weight: bold; color: #27ae60; font-size: 1.1rem;">฿${item.price}</div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    totalDiv.innerText = `ยอดรวมทั้งหมด: ฿${totalAll}`;
}
