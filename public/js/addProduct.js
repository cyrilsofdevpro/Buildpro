// js/addProduct.js
import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const form = document.getElementById("productForm");
const msg = document.getElementById("msg");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Check if admin or approved freelancer
  const isAdmin = user.email === "admin@builpro.com";
  let isApprovedFreelancer = false;

  try {
    const freelancerDoc = await getDoc(doc(db, "freelancer_applications", user.uid));
    if (freelancerDoc.exists() && freelancerDoc.data().status === "approved") {
      isApprovedFreelancer = true;
    }
  } catch (err) {
    console.error("Error checking freelancer status", err);
  }

  if (!isAdmin && !isApprovedFreelancer) {
    msg.textContent = "❌ Only admins or approved freelancers can post products.";
    form.style.display = "none";
    return;
  }

  // Allow product submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();
    const imageUrl = document.getElementById("imageUrl").value.trim();

    if (!name || !category || !price || !description || !imageUrl) {
      msg.textContent = "❌ All fields are required.";
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        category,
        price,
        description,
        imageUrl,
        createdAt: serverTimestamp(),
        postedBy: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "Anonymous"
        },
        approved: isAdmin ? true : false
      });

      msg.textContent = "✅ Product posted successfully!";
      form.reset();
    } catch (err) {
      console.error("❌ Error posting product:", err);
      msg.textContent = "❌ Failed to post product.";
    }
  });
});
