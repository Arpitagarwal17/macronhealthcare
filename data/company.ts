export function createWhatsAppLink(message: string) {
  return `https://wa.me/919414073960?text=${encodeURIComponent(message)}`;
}

export const company = {
  name: "MACRON HEALTH CARE",
  displayName: "Macron Health Care",
  director: "Mr. RB Gupta",
  servingSince: "1999",
  tagline: "Committed to Quality and Services",
  websiteUrl: "https://www.macronhealthcare.com",
  website: "www.macronhealthcare.com",
  email: "rb.macron@gmail.com",
  contactNumbers: ["+91 94140 73960"],
  contactLinks: {
    whatsapp: {
      display: "+91 94140 73960",
      href: createWhatsAppLink(
        "Hello Macron Health Care, I would like to know more about your products.",
      ),
      ariaLabel: "Chat with Macron Health Care on WhatsApp",
    },
    phone: {
      display: "+91 94140 73960",
      href: "tel:+919414073960",
      ariaLabel: "Call Macron Health Care",
    },
    email: {
      display: "rb.macron@gmail.com",
      href: "mailto:rb.macron@gmail.com",
      ariaLabel: "Email Macron Health Care",
    },
    website: {
      display: "www.macronhealthcare.com",
      href: "https://www.macronhealthcare.com",
      ariaLabel: "Visit Macron Health Care website",
    },
  },
  addresses: [
    {
      label: "Registered Office Ahmedabad",
      lines: [
        "S.P.O.: 2, Nanawati Society, 1st Floor, Ambrai Bari, Ahmedabad, Gujarat",
      ],
    },
    {
      label: "Jaipur Depot / Operational Address",
      lines: [
        "78, Basement Floor, SBBJ Officer's Colony, New Sanganer Road, Near Mansarovar Metro Station, Jaipur - 302020, Rajasthan, India",
      ],
    },
  ],
  registrations: [
    { label: "GSTIN", value: "08AJTPG1414G1ZB" },
  ],
  brandLines: [
    "Committed to Quality and Services",
    "At Your Service Since 1999",
  ],
};
