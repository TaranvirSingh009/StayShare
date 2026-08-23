/* 
   StayShare — components.js
   Shared UI builders used across every page
   */

const Components = {

  /** Renders the navbar into #app-navbar. Call after DOM ready. */
  renderNavbar(activePage) {
    const el = document.getElementById("app-navbar");
    if (!el) return;
    const root = Auth.rootPath();
    const user = Auth.currentUser();

    let rightSide = "";
    if (user) {
      const dashHref =
        user.role === "user" ? root + "pages/user-dashboard.html" :
        user.role === "hotelier" ? root + "pages/hotelier-dashboard.html" :
        root + "pages/admin-dashboard.html";

      rightSide = `
        <div class="nav-user">
          <span class="nav-user-name">Hi, ${escapeHtml(user.name.split(" ")[0])}</span>
          <span class="badge badge-role-${user.role}">${roleLabel(user.role)}</span>
          <a href="${dashHref}" class="btn btn-sm btn-outline">Dashboard</a>
          <button class="btn btn-sm btn-ghost" id="nav-logout-btn">Log out</button>
        </div>`;
    } else {
      rightSide = `
        <div class="nav-user">
          <a href="${root}pages/login.html" class="btn btn-sm btn-outline">Log in</a>
          <a href="${root}pages/register.html" class="btn btn-sm btn-primary">Sign up</a>
        </div>`;
    }

    el.innerHTML = `
      <nav class="navbar">
        <div class="navbar-inner">
          <a href="${root}index.html" class="nav-logo">Stay<span>Share</span></a>
          <div class="nav-links">
            <a href="${root}index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a>
            <a href="${root}pages/search.html" class="${activePage === 'search' ? 'active' : ''}">Search</a>
            ${user && user.role === 'user' ? `<a href="${root}pages/search.html?shared=1" class="${activePage === 'shared' ? 'active' : ''}">Shared Rooms</a>` : ''}
          </div>
          ${rightSide}
          <button class="nav-burger" id="nav-burger" aria-label="Menu">☰</button>
        </div>
      </nav>`;

    const logoutBtn = document.getElementById("nav-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        Auth.logout();
        location.href = root + "index.html";
      });
    }
    const burger = document.getElementById("nav-burger");
    if (burger) {
      burger.addEventListener("click", () => {
        document.querySelector(".navbar-inner").classList.toggle("nav-open");
      });
    }
  },

  renderFooter() {
    const el = document.getElementById("app-footer");
    if (!el) return;
    const root = Auth.rootPath();
    el.innerHTML = `
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="nav-logo">Stay<span>Share</span></div>
            <p>Book private rooms. Share the ones you don't need. Split the cost.</p>
          </div>
          <div class="footer-links">
            <div>
              <h4>Explore</h4>
              <a href="${root}index.html">Home</a>
              <a href="${root}pages/search.html">Search Hotels</a>
              <a href="${root}pages/search.html?shared=1">Shared Rooms</a>
            </div>
            <div>
              <h4>Account</h4>
              <a href="${root}pages/login.html">Log in</a>
              <a href="${root}pages/register.html">Sign up</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">© 2026 StayShare. Built for Evaluation 1 — HTML, CSS &amp; JS only.</div>
      </footer>`;
  },

  /** Property card HTML string */
  propertyCard(property, opts) {
    opts = opts || {};
    const root = Auth.rootPath();
    const minPrice = Math.min(...property.rooms.map(r => r.price));
    const img = property.image || placeholderImage(property.name, property.city);
    return `
      <a class="property-card" href="${root}pages/property.html?id=${property.id}">
        <div class="property-card-img" style="background-image:url('${img}')">
          <span class="property-card-badge">★ ${property.rating}</span>
          ${opts.pendingBadge ? `<span class="property-card-badge property-card-badge-pending">Pending</span>` : ""}
        </div>
        <div class="property-card-body">
          <h3>${escapeHtml(property.name)}</h3>
          <p class="property-card-city">📍 ${escapeHtml(property.city)}</p>
          <div class="property-card-footer">
            <span class="property-card-price">₹${minPrice.toLocaleString("en-IN")}<small>/night</small></span>
            <span class="property-card-cta">View →</span>
          </div>
        </div>
      </a>`;
  },

  emptyState(message, sub) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">🗂️</div>
        <p class="empty-state-title">${message}</p>
        ${sub ? `<p class="empty-state-sub">${sub}</p>` : ""}
      </div>`;
  },

  loadingState(message) {
    return `<div class="loading-state"><div class="spinner"></div><p>${message || "Loading..."}</p></div>`;
  },

  /** Toast notification */
  toast(message, type) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    const el = document.createElement("div");
    el.className = "toast toast-" + (type || "info");
    el.textContent = message;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add("toast-show"));
    setTimeout(() => {
      el.classList.remove("toast-show");
      setTimeout(() => el.remove(), 300);
    }, 3200);
  },

  /** Simple confirm modal. onConfirm is called if user confirms. */
  confirmModal(title, body, onConfirm, confirmLabel) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <p>${body}</p>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="modal-cancel">Cancel</button>
          <button class="btn btn-danger" id="modal-confirm">${confirmLabel || "Confirm"}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("modal-show"));

    function close() {
      overlay.classList.remove("modal-show");
      setTimeout(() => overlay.remove(), 200);
    }
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    overlay.querySelector("#modal-cancel").addEventListener("click", close);
    overlay.querySelector("#modal-confirm").addEventListener("click", () => {
      close();
      onConfirm();
    });
  }
};

function roleLabel(role) {
  if (role === "user") return "User";
  if (role === "hotelier") return "Hotelier";
  if (role === "superAdmin") return "Super Admin";
  return role;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function placeholderImage(name, city) {
  // Generates a deterministic soft gradient placeholder as a data URI (no external images needed)
  const hues = [198, 24, 265, 152, 340, 42];
  const hash = (name + city).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = hues[hash % hues.length];
  const h2 = hues[(hash + 2) % hues.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='hsl(${h1},55%,45%)'/>
      <stop offset='100%' stop-color='hsl(${h2},60%,32%)'/>
    </linearGradient></defs>
    <rect width='400' height='260' fill='url(#g)'/>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}
