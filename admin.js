(() => {
  const token = localStorage.getItem("nivora_admin_token");
  if (!token) {
    location.href = "login.html";
    return;
  }

  const cfg = window.NIVORA_CONFIG || { MODE: "demo", API_BASE_URL: "" };
  const demo = localStorage.getItem("nivora_admin_mode") === "demo" || cfg.MODE === "demo";
  const money = (n) => `${Number(n || 0).toLocaleString("ar-EG")} ج.م`;
  const demoSettings = { profitPercent: 10, payment: { number: "01065859268", iban: "" }, shipping: { provider: "Supplier / AliExpress" } };
  const demoProducts = Array.isArray(window.NIVORA_PRODUCTS) ? window.NIVORA_PRODUCTS : [];
  const demoOrders = JSON.parse(localStorage.getItem("nivora_demo_orders") || "[]");

  document.getElementById("logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("nivora_admin_token");
    localStorage.removeItem("nivora_admin_mode");
    location.href = "login.html";
  });

  async function api(path, options = {}) {
    if (demo) return demoApi(path, options);

    const base = String(cfg.API_BASE_URL || "").replace(/\/$/, "");
    if (!base) throw new Error("لم يتم ضبط عنوان الخادم.");
    const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
    const response = await fetch(`${base}/api/${path}`, { ...options, headers });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error("الخادم لم يُرجع JSON."); }
    if (response.status === 401) {
      localStorage.removeItem("nivora_admin_token");
      location.href = "login.html";
      return null;
    }
    if (!response.ok) throw new Error(data.error || "API error");
    return data;
  }

  function demoApi(path, options) {
    if (path === "dashboard.php") {
      const sales = demoOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const cost = demoOrders.reduce((sum, o) => sum + Number(o.costTotal || 0), 0);
      return Promise.resolve({ sales, cost, expenses: 0, profit: sales - cost, orders: demoOrders.length });
    }
    if (path === "products.php") return Promise.resolve({ products: demoProducts.map(p => ({ ...p, source: "demo", sourcePrice: Math.round(p.price / 1.1), profitPercent: 10, stock: 99 })) });
    if (path === "orders.php") return Promise.resolve({ orders: demoOrders });
    if (path === "settings.php" && (!options.method || options.method === "GET")) return Promise.resolve(demoSettings);
    if (path === "settings.php") return Promise.resolve({ ok: true });
    if (path === "aliexpress.php") return Promise.resolve({ ok: true, message: "تم تسجيل رابط المنتج في وضع التجربة. فعّل API عند ربط الخادم الحقيقي." });
    return Promise.reject(new Error("المسار غير متاح في وضع التجربة."));
  }

  async function load() {
    try {
      const dashboard = await api("dashboard.php");
      ["sales", "orders", "cost", "profit", "expenses"].forEach((key) => {
        const element = document.getElementById(key);
        if (element) element.textContent = key === "orders" ? dashboard.orders : money(dashboard[key]);
      });

      const productsTable = document.getElementById("products-table");
      if (productsTable) {
        const result = await api("products.php");
        productsTable.innerHTML = result.products.map((p) => `<tr><td>${p.title}</td><td>${p.source}</td><td>${money(p.sourcePrice)}</td><td>${p.profitPercent}%</td><td>${money(p.price)}</td><td>${p.stock}</td></tr>`).join("");
      }

      const ordersTable = document.getElementById("orders-table");
      if (ordersTable) {
        const result = await api("orders.php");
        ordersTable.innerHTML = result.orders.map((o) => `<tr><td>${o.id}</td><td>${o.customerName}</td><td>${money(o.total)}</td><td>${o.paymentStatus}</td><td>${o.status}</td><td>${new Date(o.createdAt).toLocaleString("ar-EG")}</td></tr>`).join("") || '<tr><td colspan="6">لا توجد طلبات.</td></tr>';
      }

      const settingsForm = document.getElementById("settings-form");
      if (settingsForm) {
        const settings = await api("settings.php");
        settingsForm.profitPercent.value = settings.profitPercent;
        settingsForm.vodafone.value = settings.payment.number;
        settingsForm.iban.value = settings.payment.iban || "";
        settingsForm.shipping.value = settings.shipping.provider;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  document.getElementById("import-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const result = await api("aliexpress.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      document.getElementById("import-msg").textContent = result.message;
    } catch (error) {
      document.getElementById("import-msg").textContent = error.message || "تعذر إضافة الرابط.";
    }
  });

  document.getElementById("settings-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      await api("settings.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      document.getElementById("settings-msg").textContent = demo ? "تم الحفظ في وضع التجربة ✓" : "تم الحفظ ✓";
    } catch (error) {
      document.getElementById("settings-msg").textContent = error.message || "تعذر الحفظ.";
    }
  });

  load();
})();
