// marketplace.js
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = [];

async function loadProducts() {
  productList.innerHTML = `<p class="text-gray-500 text-center">Loading products...</p>`;
  console.log("🔄 Starting to fetch products...");

  try {
    let q;

    // Try ordered query, fallback if index error
    try {
      q = query(
        collection(db, "products"),
        where("approved", "==", true),
        orderBy("createdAt", "desc")
      );
      await getDocs(q); // probe for index errors
    } catch (err) {
      console.warn("⚠️ Falling back: 'createdAt' may be missing or unindexed.");
      q = query(collection(db, "products"), where("approved", "==", true));
    }

    const snapshot = await getDocs(q);
    console.log(`✅ Retrieved ${snapshot.size} products from Firestore.`);

    allProducts = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const isValid = data.name && typeof data.price === "number";

      if (isValid) {
        allProducts.push({ id: doc.id, ...data });
        console.log("✅ Loaded product:", data);
      } else {
        console.warn(`⚠️ Skipped product ${doc.id} due to missing fields:`, data);
      }
    });

    renderProducts(allProducts);
  } catch (error) {
    console.error("❌ Error loading products:", error);
    productList.innerHTML = `<p class="text-red-600 text-center">❌ Failed to load products. Please try again.</p>`;
  }
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `<p class="text-gray-500 text-center col-span-full">No products found.</p>`;
    return;
  }

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow p-4";

    const image = product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image";

    div.innerHTML = `
      <img src="${image}" alt="${product.name}" class="w-full h-40 object-cover mb-2 rounded">
      <h3 class="text-lg font-bold">${product.name}</h3>
      <p class="text-sm text-gray-500">${product.category || "Uncategorized"}</p>
      <p class="font-semibold text-green-700">₦${Number(product.price).toLocaleString()}</p>
      <a href="product-detail.html?id=${product.id}" class="text-blue-600 hover:underline mt-2 inline-block">View Details</a>
    `;

    productList.appendChild(div);
  });
}

function applyFilters() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = allProducts.filter(product => {
    const matchesName = product.name.toLowerCase().includes(search);
    const matchesCategory = category ? product.category === category : true;
    return matchesName && matchesCategory;
  });

  renderProducts(filtered);
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

// Load products on page load
loadProducts();
