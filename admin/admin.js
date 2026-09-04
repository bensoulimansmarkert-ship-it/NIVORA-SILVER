(() => {
  const token=localStorage.getItem("nivora_admin_token"); if(!token){location.href="login.html";return}
  const money=n=>`${Number(n||0).toLocaleString("ar-EG")} ج.م`;
  document.getElementById("logout")?.addEventListener("click",e=>{e.preventDefault();localStorage.removeItem("nivora_admin_token");location.href="login.html"});
  async function api(path,opts={}){opts.headers={...(opts.headers||{}),Authorization:"Bearer "+token};const r=await fetch("../server/api/"+path,opts);if(r.status===401){localStorage.removeItem("nivora_admin_token");location.href="login.html";}if(!r.ok)throw new Error("API error");return r.json()}
  async function load(){
    try{
      const d=await api("dashboard.php"); ["sales","orders","cost","profit","expenses"].forEach(k=>{const e=document.getElementById(k);if(e)e.textContent=k==="orders"?d.orders:money(d[k])});
      const pt=document.getElementById("products-table"); if(pt){const x=await api("products.php");pt.innerHTML=x.products.map(p=>`<tr><td>${p.title}</td><td>${p.source}</td><td>${money(p.sourcePrice)}</td><td>${p.profitPercent}%</td><td>${money(p.price)}</td><td>${p.stock}</td></tr>`).join("")}
      const ot=document.getElementById("orders-table"); if(ot){const x=await api("orders.php");ot.innerHTML=x.orders.map(o=>`<tr><td>${o.id}</td><td>${o.customerName}</td><td>${money(o.total)}</td><td>${o.paymentStatus}</td><td>${o.status}</td><td>${new Date(o.createdAt).toLocaleString("ar-EG")}</td></tr>`).join("")||'<tr><td colspan="6">لا توجد طلبات.</td></tr>'}
      const sf=document.getElementById("settings-form"); if(sf){const x=await api("settings.php");sf.profitPercent.value=x.profitPercent;sf.vodafone.value=x.payment.number;sf.iban.value=x.payment.iban||"";sf.shipping.value=x.shipping.provider}
    }catch(e){console.warn(e)}
  }
  document.getElementById("import-form")?.addEventListener("submit",async e=>{e.preventDefault();try{const f=Object.fromEntries(new FormData(e.currentTarget));const r=await api("aliexpress.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});document.getElementById("import-msg").textContent=r.message}catch(err){document.getElementById("import-msg").textContent="تعذر الإضافة. تأكد من تشغيل الخادم."}});
  document.getElementById("settings-form")?.addEventListener("submit",async e=>{e.preventDefault();try{const f=Object.fromEntries(new FormData(e.currentTarget));await api("settings.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});document.getElementById("settings-msg").textContent="تم الحفظ ✓"}catch{document.getElementById("settings-msg").textContent="تعذر الحفظ."}});
  load();
})();
