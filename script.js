const PLANS = {
  silver: {
    name: "Silver", amount: 9000, cashback: 9000,
    benefits: [
      "₦9,000 ($9.00) instant cashback / smash bonus",
      "Fixed countdown time on videos and games",
      "1 second = ₦50 ($0.05)",
      "Celebrity videos: ₦1,500 ($1.50) for 30 seconds",
      "Fun games: ₦3,000 ($3.00) for 60 seconds",
      "Meta activities up to ₦2,000 ($2.00)",
      "Music streaming up to ₦1,000 ($1.00)",
      "Easy Buy sales up to ₦7,000 ($7.00)",
      "Spillovers ₦200–₦400 ($0.20–$0.40)",
      "Jovia Debit Card daily bonus $3",
      "Friday Bonus Reward (FBR) not included",
      "Jovia AI assistant not included",
    ],
  },
  gold: {
    name: "Gold", amount: 15000, cashback: 15000,
    benefits: [
      "₦15,000 ($15.00) instant cashback / smash bonus",
      "Adjustable countdown from 30 seconds up to 1 hour",
      "1 second = ₦100 ($0.10)",
      "Celebrity videos: ₦3,000 ($3.00) for 30 seconds",
      "Fun games: ₦6,000 ($6.00) for 60 seconds",
      "Meta activities up to ₦3,000 ($3.00)",
      "Music streaming up to ₦2,000 ($2.00)",
      "Easy Buy sales up to ₦13,000 ($13.00)",
      "Spillovers ₦400–₦600 ($0.40–$0.60)",
      "Jovia Debit Card daily bonus $6",
      "Friday Bonus Reward (FBR) — tap $10 every Friday",
      "Jovia AI assistant ready to help",
    ],
  },
};
const ACCOUNTS = [
  { id: "moniepoint", label: "Payment Option 1", method: "Moniepoint", number: "5129814689", name: "Nzekwe Frank Makuochukwu" },
  { id: "palmpay", label: "Payment Option 2", method: "PALMPAY", number: "8957790833", name: "JULIET NZEKWE" },
];
const KEY = "jovia_users_v1";
const SES = "jovia_session_v1";
const ICO = {
  lock: '<svg class="lk" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  lockLine: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  clip: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 6 4-6 4z"/></svg>',
  game: '<svg class="ico" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="3"/><path d="M8 12h4M10 10v4M16.5 11.5h.01M18.5 13.5h.01"/></svg>',
  head: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v6h4v-6M20 12v6h-4v-6"/></svg>',
  bag: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>',
  share: '<svg class="ico" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M8.6 10.5l6.8-4"/></svg>',
  grad: '<svg class="ico" viewBox="0 0 24 24"><path d="m12 3 10 5-10 5L2 8l10-5z"/><path d="M6 10.5V16c0 0 2.5 3 6 3s6-3 6-3v-5.5"/></svg>',
  trophy: '<svg class="ico" viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M16 6h3v2a3 3 0 0 1-3 3M8 6H5v2a3 3 0 0 0 3 3M9 20h6M12 13v7"/></svg>',
  card: '<svg class="ico" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
};

function money(n) { return "₦" + Number(n).toLocaleString("en-NG"); }
function moneyUsd(n) { return "$" + (n / 1000).toLocaleString("en-US", { maximumFractionDigits: 2 }); }
function both(n) { return money(n) + " (" + moneyUsd(n) + ")"; }
function users() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
function saveUsers(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
function session() { try { return JSON.parse(localStorage.getItem(SES) || "null"); } catch { return null; } }
function setSession(u) { localStorage.setItem(SES, JSON.stringify({ email: u.email })); }
function current() {
  const s = session();
  if (!s) return null;
  return users().find((u) => u.email === s.email) || null;
}
function updateUser(patch) {
  const s = session();
  const list = users().map((u) => (u.email === s.email ? { ...u, ...patch } : u));
  saveUsers(list);
  return list.find((u) => u.email === s.email);
}
function requireAuth() {
  if (!current()) location.href = "login.html";
}
function togglePass(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
}
function pickPlan(id) {
  const radio = document.querySelector("[name=plan][value='" + id + "']");
  if (radio) radio.checked = true;
  document.getElementById("p-silver")?.classList.toggle("selected", id === "silver");
  document.getElementById("p-gold")?.classList.toggle("selected", id === "gold");
}

function showTab(id) {
  ["home", "earn", "wallet", "history", "profile"].forEach((t) => {
    document.getElementById("tab-" + t)?.classList.toggle("hidden", t !== id);
  });
  document.querySelectorAll(".dash-nav button").forEach((b) => {
    b.classList.toggle("active", b.textContent.trim().toLowerCase() === id);
  });
}

const MODULES = [
  { id: "celebrity", title: "Celebrity videos", icon: ICO.clip, goldOnly: false },
  { id: "games", title: "Fun games", icon: ICO.game, goldOnly: false },
  { id: "music", title: "Music", icon: ICO.head, goldOnly: false },
  { id: "buy", title: "Easy Buy", icon: ICO.bag, goldOnly: false },
  { id: "meta", title: "Meta", icon: ICO.share, goldOnly: false },
  { id: "skill", title: "Skill Verse", icon: ICO.grad, goldOnly: false },
  { id: "fbr", title: "Friday FBR", icon: ICO.trophy, goldOnly: true },
  { id: "card", title: "Debit card", icon: ICO.card, goldOnly: false },
  { id: "ai", title: "Jovia AI", icon: ICO.grad, goldOnly: true },
];

function lockNote() {
  document.getElementById("lock-modal")?.classList.remove("hidden");
}

function fillModules() {
  const box = document.getElementById("modules");
  if (!box) return;
  box.innerHTML = MODULES.map((m) => `
    <button class="mod" type="button" onclick="lockNote()">
      ${ICO.lock}${m.icon}
      <div>Locked · ${m.title}</div>
      ${m.goldOnly ? "<small>GOLD</small>" : ""}
    </button>
  `).join("");
}

function startFeed(kind) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.classList.add(kind === "dash" ? "dash" : "home");
  const people = [
    ["Michael", "mike_lagos", "Lagos", "Nigeria", "received cash back from Jovia"],
    ["Grace", "grace_abj", "Abuja", "Nigeria", "completed a celebrity video session"],
    ["David", "david_ph", "Port Harcourt", "Nigeria", "received cash back from Jovia"],
    ["Sarah", "sarah_enugu", "Enugu", "Nigeria", "finished a games countdown"],
    ["Chinedu", "chinedu_ib", "Ibadan", "Nigeria", "received a music streaming reward"],
    ["Amaka", "amaka_onitsha", "Onitsha", "Nigeria", "completed an Easy Buy upload"],
    ["Fatima", "fatima_kano", "Kano", "Nigeria", "received cash back from Jovia"],
    ["Kevin", "kevin_nbo", "Nairobi", "Kenya", "received a games payout"],
    ["Daniel", "daniel_accra", "Accra", "Ghana", "completed a celebrity video session"],
    ["Victor", "victor_ldn", "London", "United Kingdom", "received cash back from Jovia"],
    ["Blessing", "blessing_benin", "Benin City", "Nigeria", "completed an Easy Buy upload"],
    ["Linda", "linda_mcr", "Manchester", "United Kingdom", "completed a celebrity video session"],
  ];
  const times = ["just now", "2 minutes ago", "5 minutes ago", "8 minutes ago", "12 minutes ago"];
  function next() {
    const p = people[Math.floor(Math.random() * people.length)];
    const t = times[Math.floor(Math.random() * times.length)];
    if (kind === "dash") {
      el.innerHTML = `<div class="row-toast"><div class="coin">₦</div><div><p class="who">${p[0]} (@${p[1]})</p><p class="meta">${p[2]}, ${p[3]}</p><p class="meta">${p[4]}</p><p class="meta">${t}</p></div></div>`;
    } else {
      el.innerHTML = `<p class="feed-kicker">♡ Platform activity feed</p><p class="who">${p[0]} (@${p[1]}) from ${p[2]}, ${p[3]}</p><p class="meta">${p[4]}</p><p class="meta">${t}</p>`;
    }
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 3400);
    setTimeout(next, 4500 + Math.floor(Math.random() * 8000));
  }
  setTimeout(next, 900 + Math.floor(Math.random() * 1600));
}

let showUsd = false;
function toggleUsd() {
  showUsd = !showUsd;
  const u = current();
  const p = PLANS[u.plan] || PLANS.silver;
  const n = p.cashback;
  document.getElementById("balance").textContent = showUsd ? moneyUsd(n) : money(n);
  document.getElementById("usd-toggle").textContent = showUsd ? "Show in naira (₦)" : "Show in dollar ($)";
}

function copyRef() {
  const t = document.getElementById("ref")?.textContent || "";
  navigator.clipboard.writeText(t).then(() => {
    const b = document.querySelector(".copy-ref");
    if (b) { b.textContent = "Referral link copied!"; setTimeout(() => b.textContent = "Copy referral link", 2000); }
  });
}

function registerForm(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target).entries());
  const err = document.getElementById("error");
  if (!f.plan) { err.textContent = "Select Silver or Gold to continue."; return; }
  if (f.password !== f.confirm) { err.textContent = "Passwords do not match."; return; }
  if (String(f.password).length < 8) { err.textContent = "Password must be at least 8 characters."; return; }
  const list = users();
  if (list.some((u) => u.email === f.email)) { err.textContent = "That email is already registered."; return; }
  list.push({
    fullName: f.fullName,
    username: String(f.username).trim(),
    email: f.email,
    phone: f.phone,
    country: f.country,
    password: f.password,
    plan: f.plan,
    activated: false,
    paymentStatus: "none",
    proofs: [],
  });
  saveUsers(list);
  setSession({ email: f.email });
  location.href = "dashboard.html";
}

function loginForm(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target).entries());
  const err = document.getElementById("error");
  const u = users().find((x) => x.email === f.email && x.password === f.password);
  if (!u) { err.textContent = "Login failed. Check your email and password."; return; }
  setSession(u);
  location.href = "dashboard.html";
}

function resetForm(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target).entries());
  const err = document.getElementById("error");
  const ok = document.getElementById("ok");
  if (f.newPassword !== f.confirm) { err.textContent = "Passwords do not match."; return; }
  const list = users();
  const i = list.findIndex((u) => u.email === f.email && String(u.username).toLowerCase() === String(f.username).toLowerCase());
  if (i < 0) { err.textContent = "No Jovia account matches that email and username."; return; }
  list[i].password = f.newPassword;
  saveUsers(list);
  ok.textContent = "Password updated. You can log in with your new password.";
  err.textContent = "";
}

function signOut() {
  localStorage.removeItem(SES);
  location.href = "login.html";
}

function renderDashboard() {
  requireAuth();
  const u = current();
  const p = PLANS[u.plan] || PLANS.silver;
  const pending = u.paymentStatus === "pending";
  const status = u.activated ? "ACTIVATED" : pending ? "PENDING VERIFICATION" : "NOT ACTIVATED";
  document.getElementById("name").textContent = u.fullName;
  document.getElementById("plan").textContent = p.name.toUpperCase();
  document.getElementById("cashback").textContent = both(p.cashback);
  document.getElementById("balance").textContent = money(p.cashback);
  document.getElementById("status").innerHTML = u.activated
    ? `Account activated — ${p.name}`
    : `<span class="ico-lock"></span> ${status}`;
  document.getElementById("status").className = "status-line " + (u.activated ? "ok" : "lock");
  document.getElementById("cashback-note").textContent = u.activated ? "" : " after activation";
  document.getElementById("avatar").textContent = (u.fullName || "U").trim().charAt(0).toUpperCase();
  document.getElementById("ref").textContent = location.origin.replace(/\/$/, "") + "/register.html?ref=" + encodeURIComponent(u.username);
  document.getElementById("feat-card").innerHTML =
    `<h2>${p.name} features</h2><ul class="feat-list">${p.benefits.map((b) => `<li>${ICO.lockLine}<span>Locked — ${b}</span></li>`).join("")}</ul>`;
  fillModules();
  document.getElementById("balance2").textContent = money(p.cashback);
  document.getElementById("earn-cash").textContent = "Cash back: " + both(p.cashback);
  document.getElementById("earn-list").innerHTML = [
    ["Celebrity videos", "Choose watch time → Press Start"],
    ["Fun games", "Choose play time → Press Start"],
    ["Music streaming", "Earn per 60s session"],
    ["Meta activities", "WhatsApp, Facebook, Instagram"],
    ["Friday Bonus Reward", "Gold only — tap $10 Fridays"],
  ].map(([t, d]) => `<button class="earn-row" type="button" onclick="lockNote()"><span><b>Locked · ${t}</b><small>${d}</small></span>${ICO.lockLine}</button>`).join("");
  document.getElementById("profile-rows").innerHTML = [
    ["Name", u.fullName], ["Username", u.username], ["Email", u.email],
    ["Phone", u.phone], ["Country", u.country], ["Plan", p.name.toUpperCase()], ["Status", status],
  ].map(([k, v]) => `<div class="prow"><span class="muted">${k}</span><strong>${v || "—"}</strong></div>`).join("");
  if (u.proofs && u.proofs.length) {
    document.getElementById("history").innerHTML = u.proofs.map((pr) =>
      `<div class="feat-card"><b>Payment proof submitted</b><div class="muted">${pr.reference || ""} · pending</div></div>`
    ).join("");
  }
}

let selectedAcc = null;
let payRef = "";
let seconds = 300;
function startPayTimer() {
  const el = document.getElementById("timer");
  if (!el) return;
  setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    el.textContent = mm + ":" + ss;
  }, 1000);
}

function renderActivation() {
  requireAuth();
  const u = current();
  const p = PLANS[u.plan] || PLANS.silver;
  document.querySelectorAll("[data-plan-name]").forEach((n) => n.textContent = p.name.toUpperCase());
  document.querySelectorAll("[data-plan-amount]").forEach((n) => n.textContent = money(p.amount));
  document.querySelectorAll("[data-plan-both]").forEach((n) => n.textContent = both(p.amount));
  if (u.activated) {
    document.getElementById("active-box").classList.remove("hidden");
    document.getElementById("plan-box").classList.add("hidden");
  }
  if (u.paymentStatus === "pending") document.getElementById("pending-note")?.classList.remove("hidden");
  payRef = "JOV-" + p.name.toUpperCase() + "-" + Date.now().toString(36).toUpperCase().slice(-6);
}

function goPay() {
  document.getElementById("plan-box").classList.add("hidden");
  document.getElementById("pay-box").classList.remove("hidden");
  document.getElementById("pay-ref").textContent = payRef;
  const box = document.getElementById("accounts");
  const u = current();
  const p = PLANS[u.plan];
  box.innerHTML = ACCOUNTS.map((a) => `
    <div class="pay-acc" id="acc-${a.id}">
      <div class="row"><strong class="badge">${a.label}</strong><button type="button" class="ghost-btn" style="width:auto;padding:6px 12px" onclick="selectAcc('${a.id}')">Select</button></div>
      <p style="font-weight:800;margin:8px 0 0">${a.method}</p>
      <button class="acc-no" type="button" onclick="copyText('${a.number}','${a.id}')">${a.number}</button>
      <p style="font-weight:800;text-transform:uppercase">${a.name}</p>
      <p class="muted">Pay exactly ${money(p.amount)} for the ${p.name} plan</p>
      <button class="ghost-btn" type="button" onclick="copyText('${a.number}','${a.id}')">COPY ACCOUNT NUMBER</button>
    </div>
  `).join("");
  startPayTimer();
}

function selectAcc(id) {
  selectedAcc = id;
  ACCOUNTS.forEach((a) => document.getElementById("acc-" + a.id)?.classList.toggle("selected", a.id === id));
  document.getElementById("error").textContent = "";
}

function copyText(v, id) {
  navigator.clipboard.writeText(v).then(() => {
    document.getElementById("copied").textContent = "Account number copied!";
    document.getElementById("copied").classList.remove("hidden");
    selectAcc(id);
  }).catch(() => {
    document.getElementById("error").textContent = "Could not copy. Long-press the account number instead.";
  });
}

function madePayment() {
  if (!selectedAcc) { document.getElementById("error").textContent = "Select Moniepoint or PalmPay to continue."; return; }
  updateUser({ paymentStatus: "pending" });
  document.getElementById("error").textContent = "";
  document.getElementById("copied").textContent = "Payment recorded as pending. Upload proof below. This does not activate your account.";
  document.getElementById("copied").classList.remove("hidden");
}

function submitProof(e) {
  e.preventDefault();
  const err = document.getElementById("error");
  if (!selectedAcc) { err.textContent = "Select Moniepoint or PalmPay first."; return; }
  const file = document.getElementById("proof").files[0];
  if (!file) { err.textContent = "Upload your payment receipt screenshot."; return; }
  const reader = new FileReader();
  reader.onload = () => {
    const u = current();
    const proofs = u.proofs || [];
    proofs.push({
      at: new Date().toISOString(),
      account: selectedAcc,
      reference: payRef,
      name: file.name,
      data: String(reader.result).slice(0, 200000),
    });
    updateUser({ paymentStatus: "pending", activated: false, proofs });
    document.getElementById("overlay").classList.remove("hidden");
  };
  reader.readAsDataURL(file);
}

function telegramProof() {
  const u = current();
  const p = PLANS[u.plan];
  const acc = ACCOUNTS.find((a) => a.id === selectedAcc) || ACCOUNTS[0];
  const msg = `Hello Jovia Admin, I have completed my registration and payment for the ${p.name.toUpperCase()} plan.\n\nName: ${u.fullName}\nUsername: ${u.username}\nSelected Plan: ${p.name}\nAmount: ${money(p.amount)}\nPayment Channel: ${acc.method}\nAccount Number: ${acc.number}\nAccount Name: ${acc.name}\nReference: ${payRef}\n\nI am sending my payment proof for verification.`;
  window.open("https://t.me/Verificationadmin0?text=" + encodeURIComponent(msg), "_blank");
}
