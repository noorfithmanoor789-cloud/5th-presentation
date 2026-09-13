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
  apiKey: "AIzaSyAb2WQTeNmDnjDbK-Ggjt4LuZhUZwSu-tQ",
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
export const ADMIN_PASSWORD = "PMA-ADMIN-2026"; // change in production

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

export const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
export const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
export const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

export async function sendApprovalEmail(toEmail, studentName, username, password) {
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS not loaded - skipping email");
    return { skipped: true };
  }
  if (EMAILJS_PUBLIC_KEY.startsWith("YOUR_")) {
    console.warn("EmailJS keys not configured - skipping email. Credentials: ", { username, password });
    return { skipped: true };
  }
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: toEmail,
    student_name: studentName,
    username: username,
    password: password,
    login_url: window.location.origin + "/login.html",
    academy_name: "Presentation Master Academy"
  });
}

/*
FIRESTORE SECURITY RULES (paste in Firebase console → Firestore → Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{docId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /students/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if request.auth != null;
    }
    match /settings/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/