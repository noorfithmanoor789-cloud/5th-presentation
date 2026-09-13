// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAb2WQTeNmDnjDbK-GgjT4LuZhUZwSu-tQ",
  authDomain: "presentation-master-acad-83fbc.firebaseapp.com",
  projectId: "presentation-master-acad-83fbc",
  storageBucket: "presentation-master-acad-83fbc.firebasestorage.app",
  messagingSenderId: "76176488408",
  appId: "1:76176488408:web:32b12e4450abe78fb364ad"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
};

export const ACADEMY_PHONE = "03234296569";
export const WHATSAPP_PHONE = "923234296569";
export const EXAM_PORTAL_URL = "https://presentation-master-academy.vercel.app/";
export const USERNAME_DOMAIN = "pma.local";
export const ADMIN_PASSWORD = "PMA-ADMIN-2026";

export function usernameToEmail(username) {
  return `${String(username).trim().toLowerCase()}@${USERNAME_DOMAIN}`;
}

export async function getPublicSettings() {
  const snap = await getDoc(doc(db, "settings", "public"));
  if (!snap.exists()) {
    return { testFee: "Set by Admin", applicationPrefix: "PMA" };
  }
  return {
    testFee: snap.data().testFee || "Set by Admin",
    applicationPrefix: snap.data().applicationPrefix || "PMA"
  };
}

export function formatDate(value) {
  if (!value) return "Not available";
  if (value.toDate) return value.toDate().toLocaleDateString();
  return new Date(value).toLocaleDateString();
}

export function setMessage(target, text, type = "ok") {
  const node = typeof target === "string" ? document.querySelector(target) : target;
  if (!node) return;
  node.textContent = text;
  node.className = `message ${type}`;
}

export function generatePassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let p = "PmA@";
  for (let i = 0; i < 8; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

export function generateUsername(prefix = "PMA") {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${suffix}`;
}

// ============================================================
// EMAILJS — CONFIGURED
// ============================================================
export const EMAILJS_PUBLIC_KEY = "5lJnrq_hPXeobIy5K";
export const EMAILJS_SERVICE_ID = "service_4v09ood";
export const EMAILJS_TEMPLATE_ID = "t2ptc48";

export async function sendApprovalEmail(toEmail, studentName, username, password) {
  // Check 1: EmailJS library loaded
  if (typeof emailjs === "undefined") {
    console.error("❌ EmailJS SDK not loaded. Add script tag in <head> of admin.html");
    return { ok: false, error: "EmailJS SDK not loaded" };
  }

  // Check 2: Keys configured
  if (
    EMAILJS_PUBLIC_KEY.startsWith("YOUR_") ||
    EMAILJS_SERVICE_ID.startsWith("YOUR_") ||
    EMAILJS_TEMPLATE_ID.startsWith("YOUR_")
  ) {
    console.error("❌ EmailJS keys not configured");
    return { ok: false, error: "EmailJS keys not configured" };
  }

  // Check 3: Recipient email
  if (!toEmail || !toEmail.includes("@")) {
    console.error("❌ Invalid recipient email:", toEmail);
    return { ok: false, error: "Invalid recipient email: " + toEmail };
  }

  // Safe init
  try {
    if (typeof emailjs.init === "function") {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  } catch (e) {
    console.warn("emailjs.init warning:", e);
  }

  // Send
  try {
    console.log("📧 Attempting to send email to:", toEmail);
    console.log("📧 Using template:", EMAILJS_TEMPLATE_ID, "| service:", EMAILJS_SERVICE_ID);

    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: toEmail,
      student_name: studentName || "Student",
      username: username,
      password: password,
      login_url: window.location.origin + "/login.html",
      academy_name: "Presentation Master Academy"
    });

    console.log("✅ Email sent successfully:", response);
    return { ok: true, response };
  } catch (err) {
    const realMessage =
      (err && (err.text || err.message)) ||
      (typeof err === "string" ? err : null) ||
      (err && err.status ? `EmailJS status ${err.status}` : null) ||
      JSON.stringify(err) ||
      "Unknown EmailJS error";

    console.error("❌ EmailJS send failed. Full error:", err);
    console.error("❌ Error message:", realMessage);
    return { ok: false, error: realMessage, detail: err };
  }
}
