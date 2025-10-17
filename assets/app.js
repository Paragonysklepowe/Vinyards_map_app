const defaultVineyards = [
  {
    id: "sunset-ridge",
    name: "Sunset Ridge Estate",
    appellation: "Dry Creek Valley",
    location: [38.6111, -122.8837],
    description:
      "Family-owned estate known for small-lot Zinfandel and panoramic terrace tastings overlooking the rolling hills.",
    highlights: [
      "Organic farming practices",
      "Chef-paired tasting menus",
      "Sunset music series May–September",
    ],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524593166156-327e1d424337?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1477429030228-029e9f6175be?auto=format&fit=crop&w=600&q=80",
    ],
    contact: {
      address: "2150 Ridge View Rd, Healdsburg, CA",
      phone: "+1 (707) 555-0141",
      email: "hello@sunsetridgeestate.com",
      website: "https://example.com/sunsetridge",
    },
  },
  {
    id: "silver-creek",
    name: "Silver Creek Cellars",
    appellation: "Russian River Valley",
    location: [38.4645, -122.9386],
    description:
      "Boutique cellar focused on cool-climate Chardonnay and Pinot Noir with guided cave tours and barrel tastings.",
    highlights: [
      "Limited-production reserve wines",
      "Newly renovated tasting lounge",
      "Electric bike vineyard tours",
    ],
    images: [
      "https://images.unsplash.com/photo-1528821154947-1aa3d1aa0fd0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1466172960597-1d58deabe2f1?auto=format&fit=crop&w=600&q=80",
    ],
    contact: {
      address: "88 Barrel House Ln, Forestville, CA",
      phone: "+1 (707) 555-0199",
      email: "visit@silvercreekcellars.com",
      website: "https://example.com/silvercreek",
    },
  },
  {
    id: "valley-vista",
    name: "Valley Vista Vineyards",
    appellation: "Sonoma Valley",
    location: [38.3214, -122.4871],
    description:
      "Historic vineyard founded in 1908 offering library tastings, vineyard jeep safaris, and culinary workshops.",
    highlights: [
      "Century-old stone cellar",
      "Estate olive oil tastings",
      "Hands-on blending classes",
    ],
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505061473061-39d4ac951e3c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=600&q=80",
    ],
    contact: {
      address: "1020 Valley Vista Rd, Glen Ellen, CA",
      phone: "+1 (707) 555-0110",
      email: "reservations@valleyvista.com",
      website: "https://example.com/valleyvista",
    },
  },
  {
    id: "starlight-hollow",
    name: "Starlight Hollow",
    appellation: "Carneros",
    location: [38.2242, -122.3493],
    description:
      "Sparkling wine house with biodynamic vineyards, sunrise sabrage experiences, and a modern tasting pavilion.",
    highlights: [
      "Biodynamic certification",
      "Chef's garden picnic pairings",
      "Guided sabrage lessons",
    ],
    images: [
      "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518166403703-87b07170c9a3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
    ],
    contact: {
      address: "455 Sparkling Way, Napa, CA",
      phone: "+1 (707) 555-0173",
      email: "cheers@starlighthollow.com",
      website: "https://example.com/starlighthollow",
    },
  },
];

const STORAGE_KEY = "vineyard-app:data";
const AUTH_STORAGE_KEY = "vineyard-app:auth";
const AUTHORIZED_USERS = [
  { username: "admin", password: "vineyard2024" },
  { username: "manager", password: "cellarpass" },
];

function loadAuthState() {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Unable to read authentication state", error);
    return false;
  }
}

function persistAuthState(value) {
  try {
    if (value) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Unable to persist authentication state", error);
  }
}

function loadVineyards() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [...defaultVineyards];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...defaultVineyards];
    return parsed;
  } catch (error) {
    console.warn("Unable to load vineyards from storage", error);
    return [...defaultVineyards];
  }
}

function saveVineyards(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Unable to save vineyards to storage", error);
  }
}

let vineyards = loadVineyards();
let selectedVineyardId = null;
let authenticated = loadAuthState();

function isAuthenticated() {
  return authenticated;
}

function setAuthenticated(value) {
  authenticated = Boolean(value);
  persistAuthState(authenticated);
  updateAdminToggleState();
}

function authenticateUser(username, password) {
  const normalizedUsername = username.trim().toLowerCase();
  return AUTHORIZED_USERS.find(
    (user) =>
      user.username.toLowerCase() === normalizedUsername && user.password === password
  );
}

const map = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: false,
}).setView([38.41, -122.64], 10);

map.getContainer().setAttribute("tabindex", "0");
map.getContainer().setAttribute("aria-label", "Map showing vineyard locations");
map.on("focus", () => map.scrollWheelZoom.enable());
map.on("blur", () => map.scrollWheelZoom.disable());

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.control.zoom({ position: "topright" }).addTo(map);

const detailContainer = document.getElementById("details-content");
const defaultDetailMarkup = detailContainer.innerHTML;
let listContainer;
let markers = [];

function renderDetails(vineyard) {
  const { name, appellation, description, highlights, images, contact } = vineyard;

  detailContainer.innerHTML = `
    <div class="details__header">
      <h2>${name}</h2>
      <span class="details__badge">${appellation}</span>
    </div>
    <p class="details__description">${description}</p>
    <h3>Highlights</h3>
    <ul>
      ${highlights.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <h3>Gallery</h3>
    <div class="gallery">
      ${images
        .map(
          (src, index) => `
            <img src="${src}" alt="${name} vineyard photo ${index + 1}" loading="lazy" />
          `
        )
        .join("")}
    </div>
    <h3>Contact</h3>
    <ul class="contact">
      <li><strong>Address</strong>${contact.address}</li>
      <li><strong>Phone</strong><a href="tel:${contact.phone.replace(/[^\d+]/g, "")}">${contact.phone}</a></li>
      <li><strong>Email</strong><a href="mailto:${contact.email}">${contact.email}</a></li>
      <li><strong>Website</strong><a href="${contact.website}" target="_blank" rel="noreferrer">Visit site</a></li>
    </ul>
  `;

  if (listContainer) {
    detailContainer.append(listContainer);
  }

  const heading = detailContainer.querySelector("h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: false });
  }

  selectedVineyardId = vineyard.id;
}

function renderDefaultDetails() {
  detailContainer.innerHTML = defaultDetailMarkup;
  if (listContainer) {
    detailContainer.append(listContainer);
  }
  selectedVineyardId = null;
}

function renderMarkers() {
  markers.forEach((marker) => marker.remove());
  markers = vineyards.map((vineyard) => {
    const marker = L.marker(vineyard.location, {
      title: vineyard.name,
    }).addTo(map);

    marker.bindPopup(`
      <strong>${vineyard.name}</strong><br />
      ${vineyard.appellation}
    `);

    marker.on("click", () => {
      renderDetails(vineyard);
      marker.openPopup();
    });

    return marker;
  });

  if (vineyards.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [40, 40] });
  } else {
    map.setView([38.41, -122.64], 10);
  }
}

function renderVineyardList() {
  if (!listContainer) return;

  if (vineyards.length === 0) {
    listContainer.innerHTML = `
      <h3>Browse Vineyards</h3>
      <p>No vineyards available yet. Use the admin panel to add one.</p>
    `;
    return;
  }

  listContainer.innerHTML = `
    <h3>Browse Vineyards</h3>
    <ul>
      ${vineyards
        .map(
          (vineyard) => `
            <li>
              <button type="button" data-vineyard-id="${vineyard.id}">
                ${vineyard.name} <span>${vineyard.appellation}</span>
              </button>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function selectVineyardById(vineyardId) {
  if (!vineyardId) {
    renderDefaultDetails();
    return;
  }

  const vineyard = vineyards.find((item) => item.id === vineyardId);
  if (!vineyard) {
    renderDefaultDetails();
    return;
  }

  renderDetails(vineyard);
  const markerIndex = vineyards.indexOf(vineyard);
  const marker = markers[markerIndex];
  if (marker) {
    marker.openPopup();
    map.panTo(marker.getLatLng());
    if (!adminPanel || adminPanel.hidden) {
      map.getContainer().focus({ preventScroll: false });
    }
  }
}

function initializeList() {
  listContainer = document.createElement("div");
  listContainer.className = "details__vineyard-list";
  detailContainer.append(listContainer);
  renderVineyardList();

  listContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-vineyard-id]");
    if (!button) return;

    selectVineyardById(button.dataset.vineyardId);
  });
}

initializeList();
renderMarkers();

if (selectedVineyardId) {
  selectVineyardById(selectedVineyardId);
} else {
  renderDefaultDetails();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    map.closePopup();
  }
});

const adminToggle = document.querySelector("[data-admin-toggle]");
const adminPanel = document.getElementById("admin-panel");
const adminClose = document.querySelector("[data-admin-close]");
const adminList = document.querySelector("[data-admin-list]");
const adminNewButton = document.querySelector("[data-admin-new]");
const adminForm = document.querySelector("[data-admin-form]");
const adminDelete = document.querySelector("[data-admin-delete]");
const adminPanelTitle = document.getElementById("admin-panel-title");
const adminLogout = document.querySelector("[data-admin-logout]");
const loginPanel = document.getElementById("login-panel");
const loginForm = document.querySelector("[data-login-form]");
const loginError = document.querySelector("[data-login-error]");
const loginCloseButtons = document.querySelectorAll("[data-login-close]");

let editingVineyardId = null;
let lastFocusedButton = null;
let loginLastFocusedElement = null;

function updateAdminToggleState() {
  if (!adminToggle) return;
  adminToggle.dataset.authenticated = isAuthenticated() ? "true" : "false";
  adminToggle.setAttribute("aria-pressed", isAuthenticated() ? "true" : "false");
  adminToggle.setAttribute(
    "aria-label",
    isAuthenticated()
      ? "Open admin panel to manage vineyards"
      : "Sign in to access the vineyard administration panel"
  );
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateId(name) {
  const slug = slugify(name);
  if (slug && !vineyards.some((item) => item.id === slug)) {
    return slug;
  }

  try {
    return crypto.randomUUID();
  } catch (error) {
    return `${slug || "vineyard"}-${Date.now()}`;
  }
}

function openLoginPanel() {
  if (!loginPanel) return;
  loginLastFocusedElement = document.activeElement;
  loginPanel.hidden = false;
  loginPanel.setAttribute("aria-hidden", "false");
  loginError && (loginError.textContent = "");
  const usernameField = loginForm?.elements.namedItem("username");
  if (usernameField instanceof HTMLElement) {
    usernameField.focus({ preventScroll: true });
  } else {
    const heading = loginPanel.querySelector("h2");
    heading?.focus({ preventScroll: true });
  }
}

function closeLoginPanel() {
  if (!loginPanel) return;
  loginPanel.hidden = true;
  loginPanel.setAttribute("aria-hidden", "true");
  loginForm?.reset();
  if (loginError) {
    loginError.textContent = "";
  }
  if (loginLastFocusedElement instanceof HTMLElement) {
    loginLastFocusedElement.focus({ preventScroll: true });
  }
}

function openAdminPanel() {
  if (!adminPanel) return;
  if (!isAuthenticated()) {
    openLoginPanel();
    return;
  }
  lastFocusedButton = document.activeElement;
  adminPanel.hidden = false;
  adminPanel.setAttribute("aria-hidden", "false");
  adminPanelTitle?.focus({ preventScroll: true });
  renderAdminList();
}

function closeAdminPanel() {
  if (!adminPanel) return;
  adminPanel.hidden = true;
  adminPanel.setAttribute("aria-hidden", "true");
  if (lastFocusedButton instanceof HTMLElement) {
    lastFocusedButton.focus({ preventScroll: true });
  }
}

function renderAdminList() {
  if (!adminList) return;

  let activeId = editingVineyardId;

  if (activeId && !vineyards.some((item) => item.id === activeId)) {
    activeId = null;
  }

  if (vineyards.length === 0) {
    adminList.innerHTML = `<li class="admin-panel__empty">No vineyards yet. Use the form to add one.</li>`;
    editingVineyardId = null;
    populateAdminForm(null);
    return;
  }

  if (!activeId) {
    activeId = vineyards[0].id;
  }

  adminList.innerHTML = vineyards
    .map(
      (vineyard) => `
        <li>
          <button type="button" data-admin-item="${vineyard.id}" ${
            activeId === vineyard.id ? "class=\"is-active\"" : ""
          }>
            <span>${vineyard.name}</span>
            <small>${vineyard.appellation}</small>
          </button>
        </li>
      `
    )
    .join("");

  editingVineyardId = activeId;
  populateAdminForm(editingVineyardId);
}

function getControl(name) {
  if (!adminForm) return null;
  const control = adminForm.elements.namedItem(name);
  if (
    control instanceof HTMLInputElement ||
    control instanceof HTMLTextAreaElement ||
    control instanceof HTMLSelectElement
  ) {
    return control;
  }
  if (control instanceof RadioNodeList) {
    return control;
  }
  return null;
}

function setControlValue(name, value) {
  const control = getControl(name);
  if (control instanceof RadioNodeList) {
    Array.from(control).forEach((item) => {
      if (item instanceof HTMLInputElement) {
        item.checked = item.value === value;
      }
    });
    return;
  }
  if (control) {
    control.value = value ?? "";
  }
}

function populateAdminForm(vineyardId) {
  if (!adminForm) return;

  const vineyard = vineyards.find((item) => item.id === vineyardId);

  if (!vineyard) {
    editingVineyardId = null;
    adminForm.reset();
    setControlValue("highlights", "");
    setControlValue("images", "");
    return;
  }

  editingVineyardId = vineyard.id;

  setControlValue("name", vineyard.name);
  setControlValue("appellation", vineyard.appellation);
  setControlValue("latitude", vineyard.location[0]);
  setControlValue("longitude", vineyard.location[1]);
  setControlValue("description", vineyard.description);
  setControlValue("highlights", vineyard.highlights.join("\n"));
  setControlValue("images", vineyard.images.join("\n"));
  setControlValue("address", vineyard.contact.address);
  setControlValue("phone", vineyard.contact.phone);
  setControlValue("email", vineyard.contact.email);
  setControlValue("website", vineyard.contact.website);
}

function refreshAppState() {
  saveVineyards(vineyards);
  renderMarkers();
  renderVineyardList();

  if (selectedVineyardId && vineyards.some((item) => item.id === selectedVineyardId)) {
    selectVineyardById(selectedVineyardId);
  } else if (vineyards.length > 0) {
    selectVineyardById(vineyards[0].id);
  } else {
    renderDefaultDetails();
  }

  renderAdminList();
}

adminToggle?.addEventListener("click", () => {
  openAdminPanel();
});

adminClose?.addEventListener("click", () => {
  closeAdminPanel();
});

adminPanel?.addEventListener("click", (event) => {
  if (event.target === adminPanel) {
    closeAdminPanel();
  }
});

loginCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeLoginPanel();
  });
});

loginPanel?.addEventListener("click", (event) => {
  if (event.target === loginPanel) {
    closeLoginPanel();
  }
});

adminList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-admin-item]");
  if (!button) return;
  editingVineyardId = button.dataset.adminItem;
  populateAdminForm(editingVineyardId);
  renderAdminList();
});

adminNewButton?.addEventListener("click", () => {
  editingVineyardId = null;
  populateAdminForm(null);
  const controls = adminForm?.elements;
  if (!controls) return;
  const nameField = controls.namedItem("name");
  if (nameField instanceof HTMLElement) {
    nameField.focus({ preventScroll: true });
  }
});

adminForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(adminForm);

  const name = (formData.get("name") || "").toString().trim();
  const appellation = (formData.get("appellation") || "").toString().trim();
  const latitude = parseFloat((formData.get("latitude") || "").toString());
  const longitude = parseFloat((formData.get("longitude") || "").toString());
  const description = (formData.get("description") || "").toString().trim();
  const highlights = (formData.get("highlights") || "")
    .toString()
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const images = (formData.get("images") || "")
    .toString()
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const address = (formData.get("address") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const website = (formData.get("website") || "").toString().trim();

  if (!name) {
    alert("Name is required.");
    return;
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    alert("Latitude and longitude are required numbers.");
    return;
  }

  const payload = {
    id: editingVineyardId ?? generateId(name),
    name,
    appellation,
    location: [latitude, longitude],
    description,
    highlights,
    images,
    contact: {
      address,
      phone,
      email,
      website,
    },
  };

  const existingIndex = vineyards.findIndex((item) => item.id === editingVineyardId);

  if (existingIndex >= 0) {
    vineyards.splice(existingIndex, 1, payload);
  } else {
    vineyards.push(payload);
  }

  editingVineyardId = payload.id;
  selectedVineyardId = payload.id;

  refreshAppState();
  alert(`Saved ${payload.name}.`);
});

adminDelete?.addEventListener("click", () => {
  if (!editingVineyardId) {
    alert("Select a vineyard to delete.");
    return;
  }

  const vineyard = vineyards.find((item) => item.id === editingVineyardId);
  if (!vineyard) return;

  const confirmed = confirm(`Delete ${vineyard.name}? This action cannot be undone.`);
  if (!confirmed) return;

  vineyards = vineyards.filter((item) => item.id !== editingVineyardId);
  if (selectedVineyardId === editingVineyardId) {
    selectedVineyardId = vineyards[0]?.id ?? null;
  }
  editingVineyardId = vineyards[0]?.id ?? null;

  refreshAppState();
  alert(`Deleted ${vineyard.name}.`);
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const username = (formData.get("username") || "").toString();
  const password = (formData.get("password") || "").toString();

  const match = authenticateUser(username, password);

  if (!match) {
    if (loginError) {
      loginError.textContent = "Incorrect username or password. Please try again.";
    }
    const passwordField = loginForm.elements.namedItem("password");
    if (passwordField instanceof HTMLElement) {
      passwordField.focus({ preventScroll: true });
    }
    return;
  }

  setAuthenticated(true);
  closeLoginPanel();
  alert(`Welcome, ${match.username}!`);
  openAdminPanel();
});

adminLogout?.addEventListener("click", () => {
  setAuthenticated(false);
  closeAdminPanel();
  alert("You have been signed out.");
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (adminPanel && !adminPanel.hidden) {
      closeAdminPanel();
    }
    if (loginPanel && !loginPanel.hidden) {
      closeLoginPanel();
    }
  }
});

updateAdminToggleState();
