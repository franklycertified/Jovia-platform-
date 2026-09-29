const PLANS = {
  silver: { name: "Silver", amount: 9000, cashback: 9000 },
  gold: { name: "Gold", amount: 15000, cashback: 15000 },
};
const ACCOUNTS = [
  { id: "moniepoint", label: "Payment Option 1", method: "Moniepoint", number: "5129814689", name: "Nzekwe Frank Makuochukwu" },
  { id: "palmpay", label: "Payment Option 2", method: "PALMPAY", number: "8957790833", name: "JULIET NZEKWE" },
];
const KEY = "jovia_users_v1";
const SES = "jovia_session_v1";

function money(n) { return "₦" + Number(n).toLocaleString("en-NG"); }
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
  document.getElementById("name").textContent = u.fullName;
  document.getElementById("plan").textContent = p.name.toUpperCase();
  document.getElementById("cashback").textContent = money(p.cashback);
  document.getElementById("balance").textContent = money(p.cashback);
  document.getElementById("status").textContent = u.activated ? "ACCOUNT ACTIVATED" : (u.paymentStatus === "pending" ? "PENDING VERIFICATION" : "NOT ACTIVATED");
  document.getElementById("status").className = u.activated ? "ok" : "lock";
  document.getElementById("ref").textContent = location.origin + "/register.html?ref=" + encodeURIComponent(u.username);
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
  document.querySelectorAll("[data-plan-both]").forEach((n) => n.textContent = money(p.amount) + " ($" + (p.amount / 1000) + ")");
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
