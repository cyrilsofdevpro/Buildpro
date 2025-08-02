// js/productDetail.js
import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const container = document.getElementById("productDetails");

async function loadProduct() {
  if (!productId) {
    container.innerHTML = `<p class="text-red-500">Invalid product ID.</p>`;
    return;
  }

  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    container.innerHTML = `<p class="text-red-500">Product not found.</p>`;
    return;
  }

  const p = docSnap.data();

  container.innerHTML = `
    <div class="grid md:grid-cols-2 gap-6">
      <img src="${p.imageUrl}" alt="${p.name}" class="w-full rounded shadow">
      <div>
        <h1 class="text-2xl font-bold mb-2">${p.name}</h1>
        <p class="text-gray-500 mb-1">${p.category}</p>
        <p class="text-xl text-blue-700 font-semibold mb-4">₦${p.price}</p>
        <p class="mb-4">${p.description}</p>

        <div class="mt-4 bg-gray-100 p-3 rounded">
          <h2 class="font-semibold text-gray-700 mb-1">Seller Info</h2>
          <p><strong>Name:</strong> ${p.postedBy?.name || "Unknown"}</p>
          <p><strong>Email:</strong> <a href="mailto:${p.postedBy?.email}" class="text-blue-600 underline">${p.postedBy?.email}</a></p>
        </div>
      </div>
    </div>
  `;
}


function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(productId)) {
      cart.push(productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert("✅ Added to cart!");
    } else {
      alert("🛒 Already in cart.");
    }
  }
  
loadProduct();
