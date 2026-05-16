export const CMS_DEFAULTS: Record<string, any[]> = {
  home: [
    {
      section: "hero",
      displayOrder: 1,
      content: {
        title: "Artistry in Every Unveiling.",
        subtitle: "The 2024 Winter Edit",
        description: "Elevating the art of the return gift. Hand-selected treasures from India's heartlands, encased in heirloom-quality packaging."
      }
    },
    {
      section: "soul-of-sru",
      displayOrder: 2,
      content: {
        title: "The Soul of Sru",
        quote: "Honoring heritage, one knot at a time.",
        description1: "We believe a gift should be a bridge between the giver's intent and the heritage legacy. 'Sru' — meaning 'to flow' or 'to create' — reflects our commitment to the fluid continuity of Indian craft.",
        description2: "Every piece in our collection is sourced directly from clusters across Rajasthan, Bengal, and Tamil Nadu, ensuring that the luxury you experience supports the hands that built it."
      }
    },
    {
      section: "curated-ledger",
      displayOrder: 3,
      content: {
        title: "The Curated Ledger",
        description: "Browse our seasonal edits, categorized by craft and occasion. Each collection is a limited run to ensure exclusivity."
      }
    },
    {
      section: "recent-curations",
      displayOrder: 4,
      content: {
        title: "Recent Curations"
      }
    }
  ],
  about: [
    {
      section: "header",
      content: {
        title: "Our Story",
        subtitle: "The Heritage Legacy",
        description: "Curated Heritage was born out of a deep appreciation for Indian handcrafted heritage and the timeless beauty of handmade objects."
      }
    },
    {
      section: "mission",
      content: {
        title: "Our Mission",
        items: [
          { title: "Ethical Sourcing", content: "We ensure fair wages and safe working conditions for all our heritage partners." },
          { title: "Preserving Heritage", content: "We help keep ancient traditions alive for future generations." },
          { title: "Modern Design", content: "We adapt traditional crafts for the modern aesthetic without losing their soul." }
        ]
      }
    }
  ],
  contact: [
    {
      section: "header",
      content: {
        title: "Get in Touch",
        description: "Whether you have a question about our catalog, a custom request, or just want to say hello, we'd love to hear from you."
      }
    },
    {
      section: "details",
      content: {
        email: "concierge@craftedbysru.com",
        phone: "+91 98765 43210",
        address: "Creative Quarter, Creative District, Mumbai, India"
      }
    }
  ],
  privacy: [
    {
      section: "main",
      content: {
        title: "Privacy Policy",
        intro: "At Crafted by Sru, we value the trust you place in us when sharing your personal information.",
        sections: [
          {
            title: "Information We Collect",
            content: "We collect information that you provide directly to us, including contact information and order details."
          }
        ]
      }
    }
  ],
  "return-policy": [
    {
      section: "main",
      content: {
        title: "Returns & Exchanges",
        intro: "Due to the handcrafted nature of our products, each item is unique. At Crafted by Sru, we strive for perfection in every piece we curate.",
        sections: [
          {
            title: "Our Policy",
            content: "We accept returns only for damaged products reported within 48 hours of delivery."
          },
          {
            title: "Refund Timeline",
            content: "Refunds are processed within 7-10 business days after we receive and inspect the returned item."
          }
        ]
      }
    }
  ],
  terms: [
    {
      section: "main",
      content: {
        title: "Terms of Service",
        intro: "By accessing or using the Crafted by Sru website, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
        sections: [
          {
            title: "Acceptance of Terms",
            content: "By accessing or using the Crafted by Sru website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
          },
          {
            title: "Use License",
            content: "Permission is granted to temporarily download one copy of the materials (information or software) on Crafted by Sru's website for personal, non-commercial transitory viewing only."
          }
        ]
      }
    }
  ],
  shipping: [
    {
      section: "main",
      content: {
        title: "Shipping Policy",
        intro: "We deliver our handcrafted treasures worldwide with the utmost care.",
        details: "Standard shipping takes 10-15 business days across India. International orders may vary."
      }
    }
  ],
  config: [
    {
      section: "shipping-logic",
      content: {
        baseCharge: 500,
        freeAbove: 25000,
        perItemSurcharge: 50,
        globalDisplayText: "",
        rules: [
          { minItems: 0, minPrice: 0, cost: 500, displayText: "" }
        ]
      }
    },
    {
      section: "shipping-categories",
      content: {
        categories: []
      }
    }
  ]
};
