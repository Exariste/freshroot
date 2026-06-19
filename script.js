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
  grocery: {
    "sub-rice": {label:"Rice", items:["নাজিরশাইল","মিনিকেট","বাসমতী","পোলাওয়ের চাল","কাটারিভোগ","চিনিগুঁড়া"]},
    "sub-pulses": {label:"Pulses", items:["মসুর","মুগ","ছোলা","খেসারি","বুট","মাষকলাই"]},
    "sub-oils": {label:"Oils & Ghee", items:["সয়াবিন তেল","সরিষার তেল","খাঁটি ঘি"]},
    "sub-spices": {label:"Spices", items:["হলুদ","মরিচ","ধনিয়া","জিরা","গরম মশলা","এলাচ","দারুচিনি","লবঙ্গ","তেজপাতা"]},
    "sub-essentials": {label:"Essentials", items:["লবণ","চিনি","আটা","ময়দা"]}
  },
  household: {
    "sub-householdcare": {label:"Household Care", items:["ডিটারজেন্ট পাউডার","ডিটারজেন্ট লিকুইড","ফ্লোর ক্লিনার","টয়লেট ক্লিনার","গ্লাস ক্লিনার","টিস্যু","ঘর মোছার সাবান","ক্লিনিং টুলস"]},
    "sub-mosquito": {label:"Mosquito Protection", items:["মশার কয়েল","মশা নিরোধক স্প্রে","লিকুইড ভ্যাপোরাইজার","রিপেলেন্ট ম্যাট","ইলেকট্রিক ব্যাট"]},
    "sub-personalcare": {label:"Personal Care", items:["চুলের তেল","শ্যাম্পু","কন্ডিশনার","ফেসওয়াশ","সাবান","টুথপেস্ট","টুথব্রাশ","শেভিং কিট","প্রসাধনী"]},
    "sub-babycare": {label:"Baby Care", items:["ডায়াপার","সেরেলাক","বেবি ফুড","বেবি লোশন","বেবি পাউডার","বেবি অয়েল","বেবি সাবান"]}
  },
  agro: {
    "sub-livestock": {label:"Livestock & Poultry Feed", items:["গরুর খাদ্য","ছাগলের খাদ্য","হাঁসের খাদ্য","মুরগির খাদ্য","মাছের খাদ্য"]},
    "sub-vet": {label:"Veterinary Products", items:["বিভিন্ন ভেটেরিনারি ঔষধ","কৃমিনাশক","ভিটামিন","মিনারেল সাপ্লিমেন্ট","জীবাণুনাশক","পশু পরিচর্যা সামগ্রী"]}
  }
};

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.85.5 3.58 1.36 5.07L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.13-2.9-7C16.97 3.03 14.69 2 12.04 2zm5.78 14.13c-.24.68-1.4 1.31-1.93 1.39-.49.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.84-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.55-1.16-2.95 0-1.41.74-2.1 1-2.39.26-.29.57-.36.76-.36s.38 0 .55.01c.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.74 1.22 1.6 1.98 1.1.98 2.02 1.28 2.31 1.43.29.14.46.12.63-.07.17-.19.71-.82.9-1.1.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.14.48.21.55.33.07.12.07.69-.17 1.37z"/></svg>';

function chipHTML(item){
  const msg = encodeURIComponent(`আমি ${item} অর্ডার করতে চাই`);
  return `<span class="chip" data-name="${item.toLowerCase()}">
    <span>${item}</span>
    <a class="chip-order" target="_blank" rel="noopener" href="https://wa.me/8801713366224?text=${msg}" aria-label="Order ${item} on WhatsApp">${WA_ICON}</a>
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
