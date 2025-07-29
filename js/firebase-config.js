// js/firebase-config.js

// Import Firebase core services
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Optional: Only include this if you're actively using Google Analytics
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-analytics.js";

// Firebase configuration for BuildPro
const firebaseConfig = {
  apiKey: "AIzaSyDPWkahDk1jAUh7Ws--WHhdmPnbvhwJB8s",
  authDomain: "buildpro-cbb6c.firebaseapp.com",
  projectId: "buildpro-cbb6c",
  storageBucket: "buildpro-cbb6c.appspot.com", // fixed .app typo
  messagingSenderId: "415155145815",
  appId: "1:415155145815:web:eab37d3796f839d2eda712",
  measurementId: "G-314ZF46CJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // Enable if needed

// Export Firebase services
export { auth, db };
