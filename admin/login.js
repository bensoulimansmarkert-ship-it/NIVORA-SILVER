(() => {
  const form = document.getElementById("login-form");
  const msg = document.getElementById("login-msg");
  const cfg = window.NIVORA_CONFIG || { MODE: "demo", API_BASE_URL: "" };

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "جاري التحقق...";

    const data = Object.fromEntries(new FormData(form).entries());

    if (cfg.MODE === "demo") {
      if (data.username === "admin" && data.password === "123456") {
        localStorage.setItem("nivora_admin_token", "DEMO-ADMIN-TOKEN");
        localStorage.setItem("nivora_admin_mode", "demo");
        location.href = "index.html";
      } else {
        msg.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
      }
      return;
    }

    try {
      const base = String(cfg.API_BASE_URL || "").replace(/\/$/, "");
      if (!base) throw new Error("لم يتم ضبط عنوان الخادم.");

      const response = await fetch(`${base}/api/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("الخادم لم يُرجع JSON. تأكد من عنوان الـBackend وأنه يعمل عبر HTTPS.");
      }

      if (!response.ok) throw new Error(result.error || "بيانات الدخول غير صحيحة.");
      localStorage.setItem("nivora_admin_token", result.token);
      localStorage.setItem("nivora_admin_mode", "api");
      location.href = "index.html";
    } catch (error) {
      msg.textContent = error.message;
    }
  });
})();
