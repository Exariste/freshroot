/* ============ Fresh Root — shared script ============ */

/* ---- Mobile menu (every page) ---- */
document.addEventListener("DOMContentLoaded", ()=>{
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if(menuToggle && navLinks){
    menuToggle.addEventListener("click", ()=>{
      menuToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>{
      menuToggle.classList.remove("open");
      navLinks.classList.remove("open");
    }));
  }
});

/* ---- Header search: behaves differently depending on the page ---- */
document.addEventListener("DOMContentLoaded", ()=>{
  const searchInput = document.getElementById("searchInput");
  if(!searchInput) return;
  const onProductsPage = !!document.getElementById("products");

  // Pre-fill from ?search= when arriving on products.html from elsewhere
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("search");
  if(initialQuery && onProductsPage){
    searchInput.value = initialQuery;
  }

  if(onProductsPage){
    searchInput.addEventListener("input", ()=> runProductSearch(searchInput.value));
    if(initialQuery) runProductSearch(initialQuery);
  } else {
    searchInput.addEventListener("keydown", (e)=>{
      if(e.key === "Enter" && searchInput.value.trim() !== ""){
        window.location.href = "products.html?search=" + encodeURIComponent(searchInput.value.trim());
      }
    });
  }
});

/* ============ Products page only ============ */
const DATA = {
  oil: {
    "sub-oil": {label:"Oil & Spices", items:["সরিষার তেল","সয়াবিন তেল","অলিভ অয়েল","হলুদের গুঁড়া","মরিচের গুঁড়া","ধনিয়ার গুঁড়া","জিরার গুঁড়া","গোলমরিচের গুঁড়া","পাঁচফোড়ন","দারুচিনি","এলাচ","লবঙ্গ","আস্ত জিরা","তেজপাতা","আদা"]}
  },
  home: {
    "sub-home": {label:"Home Care", items:["তরল কাপড় ধোয়ার ডিটারজেন্ট","ডিটারজেন্ট পাউডার","থালা-বাসন ধোয়ার তরল","ফ্লোর ক্লিনার","টয়লেট ক্লিনার","গ্লাস ক্লিনার","ফ্যাব্রিক সফটনার","মাল্টি-পারপাস ক্লিনার","এয়ার ফ্রেশনার","জীবাণুনাশক তরল","টিস্যু পেপার","বাথরুম ক্লিনার","কাপড় ধোয়ার বার সাবান","ব্লিচিং লিকুইড","দাগ অপসারণকারী"]}
  },
  beauty: {
    "sub-beauty": {label:"Beauty Care", items:["ফাউন্ডেশন","কমপ্যাক্ট পাউডার","কনসিলার","লিপস্টিক","আইলাইনার","মাসকারা","আইশ্যাডো প্যালেট","কাজল","ব্লাশ","হাইলাইটার","মেকআপ সেটিং স্প্রে","মেকআপ রিমুভার","লিপ গ্লস","মেকআপ টুলস","নেইল পলিশ ও রিমুভার"]}
  },
  personal: {
    "sub-personal": {label:"Personal Care", items:["গোসলের সাবান","ফেসওয়াশ","শ্যাম্পু","কন্ডিশনার","বডি ওয়াশ","শাওয়ার জেল","চুলের তেল","টুথপেস্ট","টুথব্রাশ","বডি লোশন","ফেস ক্রিম","সানস্ক্রিন","ডিওডোরেন্ট","হ্যান্ডওয়াশ","লিপ বাম","স্যানিটারি প্যাড","শেভিং কিট","নেইল কাটার"]}
  },
  baby: {
    "sub-baby": {label:"Baby Care", items:["বেবি ডায়াপার","বেবি ওয়েট ওয়াইপস","বেবি সাবান","বেবি শ্যাম্পু","বেবি লোশন","বেবি অয়েল","বেবি পাউডার","বেবি বডি ওয়াশ","বেবি ক্রিম","বেবি ফিডিং বোতল","বেবি বোতল পরিষ্কারক","বেবি ফুড","বেবি সিরিয়াল","বেবি টুথপেস্ট","বেবির কাপড় ধোয়ার ডিটারজেন্ট"]}
  },
  grocery: {
    "sub-grocery": {label:"Food & Grocery", items:["চাল","আটা","মসুর ডাল","ছোলা","চিনি","লবণ","চা","কফি","মধু","বিস্কুট","ওটস","কর্নফ্লেক্স","টমেটো কেচাপ","পিনাট বাটার (চিনাবাদামের মাখন)","কাঠবাদাম"]}
  }
};

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7C16.97 3.03 14.69 2 12.04 2zm5.78 14.13c-.24.68-1.4 1.31-1.93 1.39-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.55-1.16-2.95 0-1.41.74-2.1 1-2.39.26-.29.57-.36.76-.36s.38 0 .55.01c.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.74 1.22 1.6 1.98 1.1.98 2.02 1.28 2.31 1.43.29.14.46.12.63-.07.17-.19.71-.82.9-1.1.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.69-.17 1.37z"/></svg>';

function chipHTML(item){
  const msg = encodeURIComponent(`আমি ${item} অর্ডার করতে চাই`);
  return `<span class="chip" data-name="${item.toLowerCase()}">
    <span class="chip-text">${item}</span>
    <span class="chip-actions">
      <button class="chip-cart" type="button" data-item="${item}" aria-label="কার্টে যোগ করুন">+</button>
      <a class="chip-order" target="_blank" rel="noopener" href="https://wa.me/8801713366224?text=${msg}" aria-label="Order ${item} on WhatsApp">${WA_ICON}</a>
    </span>
  </span>`;
}

function buildProductPanels(){
  Object.entries(DATA).forEach(([catKey, subgroups])=>{
    const panel = document.querySelector(`.category-panel[data-panel="${catKey}"]`);
    if(!panel) return;
    Object.entries(subgroups).forEach(([subId, sub])=>{
      const row = panel.querySelector(`#${subId} .chip-row`);
      if(row) row.innerHTML = sub.items.map(chipHTML).join("");
    });
  });
}

function setTab(name){
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("active", b.dataset.tab===name));
  document.querySelectorAll(".category-panel").forEach(p=>p.classList.toggle("active", p.dataset.panel===name));
}

function runProductSearch(rawQuery){
  const q = rawQuery.trim().toLowerCase();
  const noResults = document.getElementById("noResults");
  if(q === ""){
    document.body.classList.remove("search-mode");
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("hidden"));
    document.querySelectorAll(".subgroup").forEach(s=>s.style.display="");
    if(noResults) noResults.classList.remove("show");
    return;
  }
  document.body.classList.add("search-mode");
  let anyVisible = false;
  document.querySelectorAll(".subgroup").forEach(group=>{
    let groupHasMatch = false;
    group.querySelectorAll(".chip").forEach(chip=>{
      const match = chip.dataset.name.includes(q);
      chip.classList.toggle("hidden", !match);
      if(match){ groupHasMatch = true; anyVisible = true; }
    });
    group.style.display = groupHasMatch ? "" : "none";
  });
  if(noResults) noResults.classList.toggle("show", !anyVisible);
}

function findCategoryForSub(subId){
  for(const [catKey, subgroups] of Object.entries(DATA)){
    if(subgroups[subId]) return catKey;
  }
  return null;
}

function jumpToHash(){
  const id = window.location.hash.replace("#","");
  if(!id) return;
  const cat = findCategoryForSub(id);
  if(!cat) return;
  setTab(cat);
  const el = document.getElementById(id);
  if(!el) return;
  setTimeout(()=>{
    el.scrollIntoView({behavior:"smooth", block:"start"});
    el.classList.add("flash");
    setTimeout(()=> el.classList.remove("flash"), 2200);
  }, 60);
}

document.addEventListener("DOMContentLoaded", ()=>{
  if(!document.getElementById("products")) return;
  buildProductPanels();

  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>setTab(btn.dataset.tab));
  });

  if(window.location.hash){
    jumpToHash();
  } else {
    const params = new URLSearchParams(window.location.search);
    if(!params.get("search")) setTab("grocery");
  }
});
window.addEventListener("hashchange", jumpToHash);

/* ============ Contact page only ============ */
document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("contactForm");
  if(!form) return;
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const contact = document.getElementById("cf-contact").value.trim();
    const message = document.getElementById("cf-message").value.trim();

    const subject = encodeURIComponent(`Website inquiry from ${name || "a customer"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:info@exariste.com?subject=${subject}&body=${body}`;

    if(status){
      status.textContent = "আপনার মেইল অ্যাপ খুলছে — পাঠানো নিশ্চিত করুন।";
      status.classList.add("show");
    }
  });
});

/* ============ Cart (Products page) — submits to Google Form/Sheet ============ */

// ⚠️ STEP 4 এ Google Form বানানোর পর এই ৫টা মান বসিয়ে দিন:
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSezXAr0-f3Tc3DaUZRpCFBr82FQipL_tPgwXggYuFRaMcnJrg/formResponse";
const ENTRY = {
  name:    "entry.917195860",
  phone:   "entry.1340509731",
  address: "entry.235764943",
  order:   "entry.551415346",
  notes:   "entry.361523153"
};

const CART_KEY = "freshroot_cart";
let cart = [];
try{ cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }catch(e){ cart = []; }

function saveCart(){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){}
}

function addToCart(name){
  const existing = cart.find(i=>i.name===name);
  if(existing){ existing.qty++; } else { cart.push({name, qty:1}); }
  saveCart();
  renderCart();
  pulseCartFab();
}

function changeQty(name, delta){
  const item = cart.find(i=>i.name===name);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(i=>i.name!==name);
  saveCart();
  renderCart();
}

function removeFromCart(name){
  cart = cart.filter(i=>i.name!==name);
  saveCart();
  renderCart();
}

function cartCount(){ return cart.reduce((s,i)=>s+i.qty,0); }

function renderCart(){
  const badge = document.getElementById("cartCount");
  if(badge) badge.textContent = cartCount();

  const list = document.getElementById("cartItemsList");
  if(!list) return;

  if(cart.length===0){
    list.innerHTML = `<p class="cart-empty">আপনার কার্ট এখনো খালি — পণ্যের পাশে সবুজ "+" বাটনে চেপে যোগ করুন।</p>`;
    return;
  }
  list.innerHTML = cart.map(i=>`
    <div class="cart-row">
      <span class="cart-row-name">${i.name}</span>
      <div class="cart-row-qty">
        <button type="button" data-act="dec" data-name="${i.name}" aria-label="কমান">−</button>
        <span>${i.qty}</span>
        <button type="button" data-act="inc" data-name="${i.name}" aria-label="বাড়ান">+</button>
      </div>
      <button type="button" class="cart-row-remove" data-act="remove" data-name="${i.name}" aria-label="সরান">✕</button>
    </div>
  `).join("");
}

function toggleCartDrawer(open){
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if(!drawer) return;
  const show = (open===undefined) ? !drawer.classList.contains("open") : open;
  drawer.classList.toggle("open", show);
  if(overlay) overlay.classList.toggle("show", show);
  document.body.classList.toggle("cart-open", show);
}

function pulseCartFab(){
  const fab = document.getElementById("cartFab");
  if(!fab) return;
  fab.classList.remove("pulse");
  void fab.offsetWidth;
  fab.classList.add("pulse");
}

function submitOrderToGoogleForm(payload){
  const fd = new FormData();
  fd.append(ENTRY.name, payload.name);
  fd.append(ENTRY.phone, payload.phone);
  fd.append(ENTRY.address, payload.address);
  fd.append(ENTRY.order, payload.orderText);
  fd.append(ENTRY.notes, payload.notes);
  // no-cors: Google Forms doesn't send back CORS headers, response is opaque but the submission still lands in the Sheet.
  return fetch(GOOGLE_FORM_ACTION, { method:"POST", mode:"no-cors", body: fd });
}

document.addEventListener("DOMContentLoaded", ()=>{
  if(!document.getElementById("products")) return; // cart UI only lives on products.html
  renderCart();

  document.getElementById("cartFab")?.addEventListener("click", ()=>toggleCartDrawer());
  document.getElementById("cartClose")?.addEventListener("click", ()=>toggleCartDrawer(false));
  document.getElementById("cartOverlay")?.addEventListener("click", ()=>toggleCartDrawer(false));

  document.addEventListener("click", (e)=>{
    const cartBtn = e.target.closest(".chip-cart");
    if(cartBtn){ addToCart(cartBtn.dataset.item); return; }

    const act = e.target.closest("[data-act]");
    if(act){
      const name = act.dataset.name;
      if(act.dataset.act==="inc") changeQty(name, 1);
      if(act.dataset.act==="dec") changeQty(name, -1);
      if(act.dataset.act==="remove") removeFromCart(name);
    }
  });

  const checkoutForm = document.getElementById("checkoutForm");
  if(checkoutForm){
    checkoutForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const status = document.getElementById("cartStatus");
      if(cart.length===0){ alert("আপনার কার্ট খালি — অন্তত একটা পণ্য যোগ করুন।"); return; }

      const name = document.getElementById("co-name").value.trim();
      const phone = document.getElementById("co-phone").value.trim();
      const address = document.getElementById("co-address").value.trim();
      const notes = document.getElementById("co-notes").value.trim();
      if(!name || !phone || !address){ alert("নাম, ফোন নম্বর ও ঠিকানা লিখুন।"); return; }

      const orderText = cart.map(i=>`${i.name} x${i.qty}`).join(", ");
      const submitBtn = checkoutForm.querySelector("button[type=submit]");
      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = "পাঠানো হচ্ছে..."; }

      submitOrderToGoogleForm({name, phone, address, orderText, notes})
        .then(()=>{
          const waMsg = encodeURIComponent(
            `নতুন অর্ডার:\nনাম: ${name}\nফোন: ${phone}\nঠিকানা: ${address}\nপণ্য: ${orderText}${notes ? "\nনোট: "+notes : ""}`
          );
          window.open(`https://wa.me/8801713366224?text=${waMsg}`, "_blank");

          cart = [];
          saveCart();
          renderCart();
          checkoutForm.reset();
          toggleCartDrawer(false);
          if(status){
            status.textContent = "আপনার অর্ডার জমা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।";
            status.classList.add("show");
            setTimeout(()=>status.classList.remove("show"), 6000);
          }
        })
        .catch(()=>{
          alert("দুঃখিত, অর্ডার পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন অথবা সরাসরি WhatsApp এ অর্ডার করুন।");
        })
        .finally(()=>{
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = "অর্ডার সাবমিট করুন"; }
        });
    });
  }
});
