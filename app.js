// NOVA demo storefront. Replace demo products, links, and checkout with your real backend before launch.
const CONFIG = {
  // ضع رابط دعوة Discord الخاص بك هنا:
  discordInvite: "https://discord.com/",
  currency: "ر.س",
  // بيانات المنتجات التجريبية — عدّل الاسم والوصف والسعر والرمز حسب متجرك.
  products: [
    {id:1,name:"حزمة صانع المحتوى",category:"أدوات",description:"أدوات مختارة لتنظيم محتواك وتسريع سير العمل.",price:49,icon:"✦",tag:"الأكثر طلباً",accent:"#58f0d1",glow:"#58f0d133"},
    {id:2,name:"اشتراك بلس الرقمي",category:"اشتراكات",description:"مزايا إضافية وتجربة استخدام أكثر مرونة.",price:79,icon:"◉",tag:"مميز",accent:"#a98aff",glow:"#a98aff33"},
    {id:3,name:"باقة المصمم الإبداعية",category:"أدوات",description:"موارد وأفكار تساعدك على إطلاق إبداعك.",price:35,icon:"⌘",tag:"جديد",accent:"#76aaff",glow:"#76aaff33"},
    {id:4,name:"بطاقة لاعب",category:"ألعاب",description:"هدية رقمية لعشاق الألعاب والترفيه.",price:25,icon:"♢",tag:"هدية رائعة",accent:"#ff75bd",glow:"#ff75bd33"},
    {id:5,name:"حزمة الإنتاجية",category:"أدوات",description:"اجمع مهامك اليومية في مساحة منظمة.",price:59,icon:"▦",tag:"اختيارنا",accent:"#ffc477",glow:"#ffc47733"},
    {id:6,name:"عضوية المجتمع",category:"اشتراكات",description:"ابقَ على اطلاع بالتحديثات والمحتوى الحصري.",price:19,icon:"⌁",tag:"قيمة ممتازة",accent:"#58f0d1",glow:"#58f0d133"},
    {id:7,name:"باقة ألعاب مصغّرة",category:"ألعاب",description:"مجموعة رقمية لمحبي التحديات والمرح.",price:39,icon:"✧",tag:"شائع",accent:"#a98aff",glow:"#a98aff33"},
    {id:8,name:"قالب متجر رقمي",category:"أدوات",description:"نقطة بداية أنيقة لمشروعك الرقمي القادم.",price:99,icon:"▣",tag:"احترافي",accent:"#76aaff",glow:"#76aaff33"}
  ]
};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let cart = {};
let activeCategory = "الكل";
let currentUser = null;
let toastTimer;
const money = n => `${Number(n).toLocaleString("en-US")} ${CONFIG.currency}`;
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2500)}
function renderProducts(){
  let items=CONFIG.products.filter(p=>(activeCategory==="الكل"||p.category===activeCategory)&&(`${p.name} ${p.description} ${p.category}`.includes($("#searchInput").value.trim())));
  const sort=$("#sortSelect").value;if(sort==="low")items.sort((a,b)=>a.price-b.price);if(sort==="high")items.sort((a,b)=>b.price-a.price);
  $("#productsGrid").innerHTML=items.length?items.map(p=>`<article class="product-card">
    <div class="product-image" style="--accent:${p.accent};--glow:${p.glow}"><span class="product-tag">${p.tag}</span><span class="product-symbol">${p.icon}</span></div>
    <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p class="product-desc">${p.description}</p>
    <div class="product-bottom"><div class="price">${money(p.price)} <small>/ مرة واحدة</small></div><div class="product-buttons"><button class="add-btn" data-add="${p.id}">＋ السلة</button><button class="buy-btn" data-buy="${p.id}">شراء</button></div></div></div></article>`).join(""):`<div class="empty-state">لم نعثر على منتجات مطابقة لبحثك.</div>`;
}
function addToCart(id,qty=1){cart[id]=(cart[id]||0)+qty;renderCart();toast("تمت إضافة المنتج إلى السلة")}
function renderCart(){
  const entries=Object.entries(cart).filter(([,q])=>q>0);const count=entries.reduce((s,[,q])=>s+q,0);
  $("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;
  $("#cartItems").innerHTML=entries.length?entries.map(([id,q])=>{const p=CONFIG.products.find(x=>x.id===+id);return `<div class="cart-row"><div class="cart-thumb" style="color:${p.accent}">${p.icon}</div><div><b>${p.name}</b><small>${money(p.price)} للقطعة</small><div class="qty"><button data-qty="${id}" data-delta="-1">−</button><span>${q}</span><button data-qty="${id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${id}">حذف</button></div>`}).join(""):`<div class="empty-state">سلتك فارغة حالياً.<br>أضف منتجاً لتبدأ.</div>`;
  const total=entries.reduce((s,[id,q])=>s+CONFIG.products.find(p=>p.id===+id).price*q,0);$("#cartTotal").textContent=money(total);
}
function openDrawer(){$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open")}
function closeAll(){$("#overlay").classList.remove("show");$("#cartDrawer").classList.remove("open");$$(".modal").forEach(m=>m.classList.remove("show"))}
function openModal(id){closeAll();$("#overlay").classList.add("show");$("#"+id).classList.add("show")}
function startCheckout(){if(!Object.keys(cart).length){toast("أضف منتجاً إلى السلة أولاً");return}closeAll();const total=Object.entries(cart).reduce((s,[id,q])=>s+CONFIG.products.find(p=>p.id===+id).price*q,0);$("#checkoutSummary").innerHTML=`<span>${Object.values(cart).reduce((a,b)=>a+b,0)} منتج في السلة</span><strong>${money(total)}</strong>`;openModal("checkoutModal")}
$("#productsGrid").addEventListener("click",e=>{const a=e.target.closest("[data-add]"),b=e.target.closest("[data-buy]");if(a)addToCart(+a.dataset.add);if(b){cart={};addToCart(+b.dataset.buy);openDrawer()}});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const id=q.dataset.qty;cart[id]=(cart[id]||0)+Number(q.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart()}if(r){delete cart[r.dataset.remove];renderCart()}});
$("#cartOpen").onclick=openDrawer;$("#overlay").onclick=closeAll;$$("[data-close]").forEach(b=>b.onclick=closeAll);$("#checkoutBtn").onclick=startCheckout;
$("#confirmOrder").onclick=()=>{toast("تم إنشاء طلب تجريبي بنجاح");cart={};renderCart();closeAll();$("#chatMessages").insertAdjacentHTML("beforeend",'<div class="message support-message">تم تسجيل طلب تجريبي محلياً. لا توجد عملية دفع حقيقية.</div>')};
$("#searchInput").addEventListener("input",renderProducts);$("#sortSelect").addEventListener("change",renderProducts);
$$(".category-card").forEach(b=>b.onclick=()=>{$$(".category-card").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeCategory=b.dataset.category;renderProducts();$("#products").scrollIntoView({behavior:"smooth"})});
$("#accountBtn").onclick=()=>openModal("accountModal");$("#accountForm").onsubmit=e=>{e.preventDefault();currentUser={name:$("#nameInput").value,email:$("#emailInput").value};closeAll();$("#accountBtn").textContent=currentUser.name.split(" ")[0];toast(`مرحباً ${currentUser.name} — وضع تجريبي`)};
$("#sellerBtn").onclick=()=>openModal("sellerModal");
$("#discordLink").href=CONFIG.discordInvite;
$("#chatOpen").onclick=()=>{$("#chatWidget").classList.add("show")};$("#chatLauncher").onclick=()=>$("#chatWidget").classList.toggle("show");$("#chatClose").onclick=()=>$("#chatWidget").classList.remove("show");
$("#chatForm").onsubmit=e=>{e.preventDefault();const input=$("#chatInput"),msg=input.value.trim();if(!msg)return;$("#chatMessages").insertAdjacentHTML("beforeend",`<div class="message user-message">${escapeHTML(msg)}</div>`);input.value="";$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;setTimeout(()=>{if($("#chatWidget").classList.contains("show")){$("#chatMessages").insertAdjacentHTML("beforeend",'<div class="message support-message">شكراً لتواصلك! هذه نافذة تجريبية. اربطها بخدمة دعم أو خادم مباشر لاستقبال الردود.</div>');$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight}},450)};
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#menuBtn").onclick=()=>document.querySelector(".topbar nav").classList.toggle("open");
$("#year").textContent=new Date().getFullYear();renderProducts();renderCart();
