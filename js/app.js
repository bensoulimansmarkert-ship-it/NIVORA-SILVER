(() => {
  const money = n => `${Number(n||0).toLocaleString("ar-EG")} ج.م`;
  const getCart = () => JSON.parse(localStorage.getItem("nivora_cart") || "[]");
  const setCart = c => { localStorage.setItem("nivora_cart", JSON.stringify(c)); updateCartCount(); };
  const updateCartCount = () => document.querySelectorAll("[data-cart-count]").forEach(e => e.textContent = getCart().reduce((s,x)=>s+x.qty,0));
  const card = p => `<article class="product-card"><a href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-img"><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="tag">925</span></div></a><div class="product-body"><h3>${p.title}</h3><p>★ ${p.rating} · فضة إسترليني</p><div class="price"><strong>${money(p.price)}</strong><button class="mini-btn" data-add="${p.id}">أضف للسلة</button></div></div></article>`;
  const render = (el, list) => { if(!el)return; el.innerHTML=list.length?list.map(card).join(""):`<div class="empty">لا توجد منتجات في هذه الفئة.</div>`; };
  document.addEventListener("click", e => {
    const b=e.target.closest("[data-add]"); if(!b)return;
    e.preventDefault(); const p=window.NIVORA_PRODUCTS.find(x=>x.id===b.dataset.add); if(!p)return;
    const c=getCart(), item=c.find(x=>x.id===p.id); item?item.qty++:c.push({id:p.id,qty:1}); setCart(c); b.textContent="تمت الإضافة ✓"; setTimeout(()=>b.textContent="أضف للسلة",1000);
  });
  document.querySelectorAll("[data-search]").forEach(b=>b.addEventListener("click",()=>{const q=prompt("ابحث عن منتج");if(q)location.href="shop.html?q="+encodeURIComponent(q)}));
  const featured=document.getElementById("featured-products"); render(featured,window.NIVORA_PRODUCTS.filter(p=>p.featured));
  const shop=document.getElementById("shop-products");
  if(shop){
    const params=new URLSearchParams(location.search); let cat=params.get("cat")||"all"; let q=(params.get("q")||"").toLowerCase();
    const draw=()=>{let list=window.NIVORA_PRODUCTS.filter(p=>(cat==="all"||p.category===cat)&&(!q||p.title.toLowerCase().includes(q))); const s=document.getElementById("sort")?.value; if(s==="low")list.sort((a,b)=>a.price-b.price);if(s==="high")list.sort((a,b)=>b.price-a.price);render(shop,list)};
    document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{cat=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");draw()})); document.getElementById("sort")?.addEventListener("change",draw); draw();
  }
  const pv=document.getElementById("product-view");
  if(pv){
    const id=new URLSearchParams(location.search).get("id")||"NV-001", p=window.NIVORA_PRODUCTS.find(x=>x.id===id)||window.NIVORA_PRODUCTS[0];
    pv.innerHTML=`<div class="detail-grid"><div class="detail-image"><img src="${p.image}" alt="${p.title}"></div><div class="detail-info"><p class="eyebrow">NIVORA / 925</p><h1>${p.title}</h1><p>★ ${p.rating} · فضة إسترليني 925</p><div class="detail-price">${money(p.price)}</div><p class="desc">${p.description}</p><div class="quantity"><span>الكمية</span><input id="qty" type="number" min="1" value="1"></div><div class="detail-actions"><button class="btn btn-light" id="add-detail">أضف للسلة</button><a class="btn" href="checkout.html">اذهب للدفع</a></div><hr style="border-color:#222;margin:35px 0"><p class="desc">فضة 925 أصلية · تغليف آمن · شحن مباشر من المورد عند تفعيل المصدر · سياسة استرجاع 14 يومًا وفق الشروط.</p></div></div>`;
    document.getElementById("add-detail").onclick=()=>{const c=getCart(),item=c.find(x=>x.id===p.id),qty=Math.max(1,Number(document.getElementById("qty").value)||1);item?item.qty+=qty:c.push({id:p.id,qty});setCart(c);alert("تمت إضافة المنتج إلى السلة");};
  }
  const sum=document.getElementById("cart-summary");
  if(sum){
    const c=getCart(); let total=0;
    if(!c.length){sum.innerHTML='<div class="empty">السلة فارغة.<br><br><a href="shop.html">العودة للمتجر</a></div>';}
    else {sum.innerHTML=c.map(x=>{const p=window.NIVORA_PRODUCTS.find(y=>y.id===x.id);const t=p.price*x.qty;total+=t;return `<div class="cart-row"><div><b>${p.title}</b><small>الكمية: ${x.qty}</small></div><strong>${money(t)}</strong></div>`}).join("")+`<div class="total-row"><b>الإجمالي</b><strong>${money(total)}</strong></div>`;}
  }
  const form=document.getElementById("checkout-form");
  if(form) form.addEventListener("submit",async e=>{e.preventDefault();const c=getCart();if(!c.length){document.getElementById("checkout-msg").textContent="السلة فارغة.";return}const data=Object.fromEntries(new FormData(form).entries());data.items=c;data.total=c.reduce((s,x)=>{const p=window.NIVORA_PRODUCTS.find(y=>y.id===x.id);return s+p.price*x.qty},0);try{const r=await fetch(`${(window.NIVORA_CONFIG?.API_BASE_URL || "server").replace(/\/$/, "")}/api/orders.php`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});if(r.ok){localStorage.removeItem("nivora_cart");form.reset();document.getElementById("checkout-msg").textContent="تم استلام طلبك بنجاح. رقم الطلب سيظهر بعد تشغيل الخادم.";updateCartCount()}else throw new Error()}catch{localStorage.setItem("nivora_pending_order",JSON.stringify(data));document.getElementById("checkout-msg").textContent="تم حفظ الطلب على الجهاز. شغّل الخادم لإرساله إلى لوحة الإدارة."}});
  updateCartCount();
})();
