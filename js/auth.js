/* 
   StayShare — auth.js
   Login / Register / Session / Role guards
   */

const Auth = {
  currentUser() {
    const session = Store.getSession();
    if (!session) return null;
    const user = Store.getUsers().find(u => u.id === session.userId);
    return user || null;
  },

  isLoggedIn() {
    return !!this.currentUser();
  },

  login(email, password) {
    const users = Store.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { ok: false, message: "Invalid email or password." };
    }

    if (user.role === "hotelier" && user.status === "pending") {
      return { ok: false, message: "Your hotelier account is awaiting approval." };
    }
    if (user.role === "hotelier" && user.status === "rejected") {
      return { ok: false, message: "Your hotelier application was rejected." };
    }
    if (user.status === "suspended") {
      return { ok: false, message: "This account has been suspended. Contact support." };
    }

    Store.setSession({ userId: user.id, loggedInAt: Date.now() });
    return { ok: true, user };
  },

  logout() {
    Store.clearSession();
  },

  register({ name, email, password, role, company }) {
    const users = Store.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: "An account with this email already exists." };
    }
    if (!name || !email || !password) {
      return { ok: false, message: "Please fill in all required fields." };
    }

    const newUser = {
      id: Store.uid(role === "hotelier" ? "hotelier" : "user"),
      name,
      email,
      password,
      role: role === "hotelier" ? "hotelier" : "user",
      status: role === "hotelier" ? "pending" : "active",
      company: role === "hotelier" ? (company || "") : undefined,
      createdAt: Date.now()
    };

    users.push(newUser);
    Store.setUsers(users);

    return { ok: true, user: newUser };
  },

  /** Path prefix to reach the site root, based on current page depth. */
  rootPath() {
    return location.pathname.includes("/pages/") ? "../" : "";
  },

  redirectToDashboard(role) {
    const root = this.rootPath();
    if (role === "user") location.href = root + "pages/user-dashboard.html";
    else if (role === "hotelier") location.href = root + "pages/hotelier-dashboard.html";
    else if (role === "superAdmin") location.href = root + "pages/admin-dashboard.html";
    else location.href = root + "index.html";
  },

  /** Require any logged-in user; redirects to login if not authenticated. Returns user or null. */
  requireAuth() {
    const user = this.currentUser();
    if (!user) {
      const root = this.rootPath();
      location.href = root + "pages/login.html";
      return null;
    }
    return user;
  },

  /** Require a specific role; redirects to access-denied if role mismatch. Returns user or null. */
  requireRole(role) {
    const user = this.requireAuth();
    if (!user) return null;
    if (user.role !== role) {
      const root = this.rootPath();
      location.href = root + "pages/access-denied.html";
      return null;
    }
    return user;
  }
};
