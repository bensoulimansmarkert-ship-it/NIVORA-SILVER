document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault(); const f=Object.fromEntries(new FormData(e.currentTarget).entries());
  try { const r=await fetch("../server/api/login.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)}); const d=await r.json(); if(!r.ok)throw new Error(d.error||"خطأ"); localStorage.setItem("nivora_admin_token",d.token); location.href="index.html"; }
  catch(err){document.getElementById("login-msg").textContent=err.message+" — إذا كنت تستخدم GitHub Pages شغّل server محليًا/مستضافًا أولًا.";}
});
