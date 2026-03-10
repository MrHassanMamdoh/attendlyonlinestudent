// ================== Firebase Setup ==================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-functions.js";

// 🔹 إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAM_Uw3aUXrdp3JNVJ_89qA6bqAToiV9gc",
  authDomain: "hadarnyapp.firebaseapp.com",
  projectId: "hadarnyapp",
  storageBucket: "hadarnyapp.firebasestorage.app",
  messagingSenderId: "228409785499",
  appId: "1:228409785499:web:8686f2668047caf60c5a3e"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// 🔹 ربط الفنكشن
const recoverPassword = httpsCallable(functions, "getStudentData2");

// ================== Event Listener ==================
document.getElementById("submitBtn").addEventListener("click", handleLookup);
async function handleLookup() {
  const teacherId = document.getElementById("gradeSelect").value.trim(); // grade = teacherId
  const studentPhone = document.getElementById("studentPhone").value.trim();
  const parentPhone = document.getElementById("parentPhone").value.trim();

  const resultBox = document.getElementById("result-box");
  const errBox = document.getElementById("error-box");

  resultBox.style.display = "none";
  errBox.style.display = "none";

  // ================== Validation ==================
  if (!teacherId) {
    showError("Please select your grade.");
    return;
  }

  if (!studentPhone || !parentPhone) {
    showError("Please fill both phone numbers.");
    return;
  }

  try {
    // ================== Call Firebase Function ==================
    const result = await recoverPassword({ teacherId, studentPhone, parentPhone });

    if (result.data.success) {
      document.getElementById("studentName").textContent = result.data.name;
      document.getElementById("studentCode").textContent = result.data.code;
      document.getElementById("pwDisplay").textContent = result.data.password;
      document.getElementById("kashfNumber").textContent = result.data.kashfNumber || "N/A";
      resultBox.style.display = "block";
    } else {
      showError(result.data.message);
    }
  } catch (err) {
    console.error(err);
    showError("Server error. Please try again later.");
  }
}

// ================== Show Error Function ==================
function showError(msg) {
  document.getElementById("errMsg").textContent = msg;
  document.getElementById("error-box").style.display = "block";
}