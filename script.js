/*
 * Global Express Logistics — shipment tracking.
 *
 * Pure vanilla JavaScript. No API, database, backend, or external service.
 * Tracking numbers are validated against a predefined object below.
 */

"use strict";

/* ---------------------------------------------------------------------------
 * Predefined shipment data (local only).
 * Add or edit entries here to support more tracking numbers.
 * ------------------------------------------------------------------------- */
const SHIPMENTS = {
  "00486LRG/VIP/00233": {
    trackingNumber: "00486LRG/VIP/00233",

    sender: "Jevina",
    senderAddress: "No. 45, Valiasr Street, Tehran, Iran",

    receiver: "Pedro Marquez Ramirez",
    receiverAddress: "Carr Leon Cueramaro Pon Desagu",
    receiverPhone: "+524793771585",

    origin: "Iran (TEH)",
    destination: "Mexico",

    status: "In Transit",
    expectedDelivery: "12 August 2026",

    service: "World Wide Express",
    serviceOption: "Diplomatic Delivery",

    weight: "15 kg",
    content: "Cash",
    payment: "Corporate Account",

    history: [
      {
        location: "Tehran, Iran",
        event: "Shipment received",
        date: "11 August 2026"
      },
      {
        location: "Iran (TEH)",
        event: "Shipment dispatched",
        date: "11 August 2026"
      },
      {
        location: "In Transit",
        event: "Shipment in transit",
        date: "12 August 2026"
      },
      
    ]
  }
};

/* Tailwind-style class strings for each status badge. */
const STATUS_BADGE_CLASSES = {
  "In Transit": "bg-accent text-accent-fg border-accent-fg/20",
  "Out for Delivery": "bg-primary/10 text-primary border-primary/20",
  "Arrived at Destination": "bg-emerald-100 text-emerald-700 border-emerald-300",
};

/* ---------------------------------------------------------------------------
 * DOM helpers
 * ------------------------------------------------------------------------- */
const form = document.getElementById("track-form");
const input = document.getElementById("tracking-input");
const result = document.getElementById("result");

/* Current year in the footer. */
document.getElementById("footer-year").textContent =
  "© " + new Date().getFullYear() + " Global Express Logistics. Worldwide shipping, simplified.";

/* ---------------------------------------------------------------------------
 * Validation + render
 * ------------------------------------------------------------------------- */
function trackShipment(rawNumber) {
  const normalized = String(rawNumber || "").trim().toUpperCase();
  if (!normalized) {
    renderPlaceholder();
    return;
  }

  const shipment = SHIPMENTS[normalized];
  if (shipment) {
    renderShipment(shipment);
  } else {
    renderNotFound();
  }
}

function renderPlaceholder() {
  result.innerHTML =
    '<div class="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">' +
    '<p class="text-sm text-muted-fg">Your shipment details will appear here once you track a number.</p>' +
    "</div>";
}

function renderNotFound() {
  result.innerHTML =
    '<div class="rounded-xl border border-destructive/30 bg-red-50 p-6 text-center">' +
    '<p class="text-base font-semibold text-destructive">Tracking number not found.</p>' +
    '<p class="mt-1 text-sm text-muted-fg">Please check your tracking number and try again.</p>' +
    "</div>";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function infoCard(label, value) {
  return (
    '<div class="rounded-xl border border-border bg-card p-4">' +
    '<p class="text-xs font-medium uppercase tracking-wider text-muted-fg">' +
    escapeHtml(label) +
    "</p>" +
    '<p class="mt-1 text-base font-semibold text-foreground">' +
    escapeHtml(value) +
    "</p>" +
    "</div>"
  );
}

function renderShipment(s) {
  const badgeClass =
    STATUS_BADGE_CLASSES[s.status] || "bg-muted text-muted-fg border-border";

  const historyItems = s.history
    .map(function (step, i) {
      const isLast = i === s.history.length - 1;
      return (
        '<li class="timeline-step relative flex gap-4 pb-6 last:pb-0">' +
        (isLast
          ? ""
          : '<span class="timeline-line absolute left-[7px] top-4 h-full w-px bg-border" aria-hidden="true"></span>') +
        '<span class="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-white"></span>' +
        '<div class="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">' +
        "<div>" +
        '<p class="text-sm font-semibold text-foreground">' +
        escapeHtml(step.event) +
        "</p>" +
        '<p class="text-sm text-muted-fg">' +
        escapeHtml(step.location) +
        "</p>" +
        "</div>" +
        '<p class="text-xs text-muted-fg sm:text-right">' +
        escapeHtml(step.date) +
        "</p>" +
        "</div>" +
        "</li>"
      );
    })
    .join("");

  result.innerHTML =
    '<div class="space-y-6">' +
    // Status banner
    '<div class="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">' +
    "<div>" +
    '<p class="text-xs font-medium uppercase tracking-wider text-muted-fg">Current Status</p>' +
    '<p class="mt-1 text-2xl font-bold text-foreground">' +
    escapeHtml(s.status) +
    "</p>" +
    "</div>" +
    '<span class="inline-flex w-fit items-center rounded-full border px-4 py-1.5 text-sm font-semibold ' +
    badgeClass +
    '">' +
    escapeHtml(s.status) +
    "</span>" +
    "</div>" +
    // Info grid
    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
    infoCard("Tracking Number", s.trackingNumber) +
    infoCard("Expected Delivery", s.expectedDelivery) +
    infoCard("Origin", s.origin) +
    infoCard("Destination", s.destination) +
    infoCard("Service Type", s.service) +
    infoCard("Weight", s.weight) +
    "</div>" +
    // History
    '<div class="rounded-xl border border-border bg-card p-6">' +
    '<h2 class="text-sm font-semibold uppercase tracking-wider text-muted-fg">Shipment Progress</h2>' +
    '<ol class="mt-4 space-y-0">' +
    historyItems +
    "</ol>" +
    "</div>" +
    "</div>";
}

/* ---------------------------------------------------------------------------
 * Events
 * ------------------------------------------------------------------------- */
form.addEventListener("submit", function (event) {
  event.preventDefault();
  trackShipment(input.value);
});

/* Render the initial placeholder. */
renderPlaceholder();

let statusTimer;

function updateShipmentStatus() {
  const shipment = SHIPMENTS["00486LRG/VIP/00233"];

  if (!shipment) return;

  const now = new Date();

  const nigeriaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

  const nigeriaTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  const arrivalDate = "2026-08-12";
  const arrivalTime = "15:00:00";

  const hasArrived =
    nigeriaDate > arrivalDate ||
    (nigeriaDate === arrivalDate && nigeriaTime >= arrivalTime);

  if (hasArrived && shipment.status !== "Arrived at Destination") {
    shipment.status = "Arrived at Destination";

    shipment.history.push({
      location: shipment.destination,
      event: "Shipment arrived at destination",
      date: "12 August 2026"
    });

    // Immediately update what the user sees
    renderShipment(shipment);

    clearInterval(statusTimer);
  }
}

// Check immediately
updateShipmentStatus();

// Keep checking until the scheduled time
statusTimer = setInterval(updateShipmentStatus, 1000);
