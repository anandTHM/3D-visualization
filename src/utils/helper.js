import CountryCode from "./country-code.json";

// ========================================================== Currecny Formatter =============================================
export const formatCurrency = (currency = "USD", amount = 0) => {
  if (typeof currency !== "string" || currency.trim() === "") {
    currency = "USD";
  }

  const localeEntry = CountryCode.find((item) => item?.currency === currency);

  const locale = localeEntry?.formattedLocale || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// ========================================================== Base URL For Navigation and API call =============================================
// export const baseUrl = "http://localhost:9000";
// export const baseUrl = "https://dev.thehousemonk.com";
export const baseUrl = "https://staging.thehousemonk.com";
// export const baseUrl = "https://dashboard.thehousemonk.com";
// export const baseUrl = "https://app.monktechlabs.com";
// ================== QA Server ================================================
// export const baseUrl = "https://qa1.thehousemonk.com";

// ========================================================== Statuses Legends For Occupancy Status  =============================================
export const OccupancyStatuses = [
  { label: "All" },
  { color: "#2E8B57", label: "Occupied" },
  { color: "#E4B667", label: "Vacant" },
  { color: "#1A94DB", label: "Booked" },
  // { color: "#00BFFF", label: "Not Ready" },
  { color: "#C84A3E", label: "Under Notice" },
];

// ========================================================== Statuses Legends For Ticktes Status  =============================================
export const ticketsStatus = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Open",
    value: "open",
    color: "#FFFF8D",
  },
  {
    label: "In-Progress",
    value: "in-progress",
    color: "#80D8FF",
  },
  {
    label: "On-Hold",
    value: "on-hold",
    color: "#DC925C",
  },
  {
    label: "Re-Open",
    value: "re-open",
    color: "#63B9D5",
  },
  // {
  //   label: "Rejected",
  //   value: "rejected",
  //   color: "#FFCDD2",
  // },
  // {
  //   label: "Resolved",
  //   value: "resolved",
  //   color: "#B9F6CA",
  // },
];

// ========================================================== Capitalize First Letter =============================================
export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

// ========================================================== Tool Tip Styles for Space =============================================
export const tooltipContainerStyle = {
  fontSize: "10px",
  padding: "1px",
  maxWidth: "100px",
  backgroundColor: "rgba(255, 255, 255, 0)",
  borderRadius: "50%",
  boxShadow: "none",
};

// ========================================================== Darken Color =============================================
export function darkenColor(hex, factor = 0.5) {
  hex = hex.replace(/^#/, "");

  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);

  r = Math.max(0, Math.floor(r * (1 - factor)));
  g = Math.max(0, Math.floor(g * (1 - factor)));
  b = Math.max(0, Math.floor(b * (1 - factor)));

  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// ========================================================== Svg Icon Generator =============================================

export const generateSvgDataUri = (number) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 47" width="21" height="27">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="20%" y2="100%">
        <stop offset="0%" style="stop-color:#FE734A;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8754D6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <path d="M15.5 0C7 0 0 7 0 15.5C0 27.8375 15.5 47 15.5 47C15.5 47 31 27.8375 31 15.5C31 7 24 0 15.5 0Z" fill="url(#gradient)" />
    <circle cx="15.5" cy="15.5" r="11.5" fill="white" />
    <text x="15.5" y="21" 
          font-family="Arial, sans-serif" 
          font-size="16" 
          font-weight="bold" 
          text-anchor="middle" 
          fill="#000000"
          text-rendering="geometricPrecision">${number}</text>
  </svg>`;

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  return URL.createObjectURL(blob);
};

// ============================================== Status Color ========================================================================
export const getStatusColor = (status) => {
  const foundStatus = ticketsStatus.find(
    (item) => item.value === status.toLowerCase()
  );
  return foundStatus ? foundStatus.color : "#FFFFFF";
};
