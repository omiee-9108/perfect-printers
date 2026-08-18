export interface ServiceItem {
  id: string;
  num: string;
  name: string;
  headline: string;
  description: string;
  badge: string;
  accentColor: string;
  features: string[];
  applications: string[];
  finishEffect: "metallic" | "drip-off" | "multicolor" | "ctp";
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "packaging" | "met-pet" | "brochures" | "multicolor" | "stationery";
  categoryLabel: string;
  description: string;
  finishTag: string;
  imageUrl: string;
  featured?: boolean;
}

export const COMPANY_INFO = {
  name: "Perfect Printers",
  tagline: "Shape Your Ideas",
  phone: "+91 99224 49926",
  phoneClean: "+919922449926",
  whatsappUrl: "https://wa.me/919922449926?text=Hello%20Perfect%20Printers%2C%20I%20would%20like%20to%20inquire%20about%20a%20printing%20quote.",
  address: "Miraj, MIDC Industrial Area, Sangli Miraj Kupwad, Maharashtra 416410, India",
  googleRating: "4.8",
  reviewCount: "33",
  experience: "20+",
  experienceYearsText: "20+ Years in the Printing Industry",
  industry: "Offset Printing / Commercial Printing",
  googleMapsUrl: "https://maps.google.com/?q=Perfect+Printers+MIDC+Miraj+Sangli+Maharashtra+416410",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.3872166668744!2d74.639148!3d16.832478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1230000000001%3A0x7d94e2b02e737c3!2sMIDC%20Industrial%20Area%2C%20Miraj%2C%20Maharashtra%20416410!5e0!3m2!1sen!2sin!4v1700000000000",
  operatingHours: "Monday – Saturday: 9:00 AM – 8:30 PM",
};

export const STATS = [
  {
    value: "20+",
    label: "Years Experience",
    subtext: "Decades of industry mastery",
    accent: "text-cmyk-cyan",
  },
  {
    value: "4.8/5",
    label: "Google Rating",
    subtext: "Consistently rated top-tier",
    accent: "text-cmyk-yellow",
  },
  {
    value: "33+",
    label: "Google Reviews",
    subtext: "Verified regional clients",
    accent: "text-cmyk-magenta",
  },
  {
    value: "100%",
    label: "Commitment to Quality",
    subtext: "Zero-compromise print fidelity",
    accent: "text-emerald-400",
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: "met-pet-printing",
    num: "01",
    name: "Met-Pet Printing",
    headline: "Distinctive Metallic Appearance & High Visual Impact",
    description:
      "Premium Met-Pet printing solutions for applications that require a distinctive metallic appearance and high visual impact.",
    badge: "Specialty Finish",
    accentColor: "#00E5FF",
    features: [
      "Substrate-level metallic luster and reflection",
      "Superior ink adhesion on metallized polyester films",
      "High opacity white underprinting for targeted foil effects",
      "Durable surface resistance against abrasion and moisture",
    ],
    applications: [
      "Luxury Cosmetic & Perfume Mono-cartons",
      "Pharmaceutical High-Security Packaging",
      "Premium FMCG & Confectionery Cartons",
      "High-Impact Promotional Displays & Folders",
    ],
    finishEffect: "metallic",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "uv-drip-off-coating",
    num: "02",
    name: "UV Drip-Off Coating",
    headline: "Contrasting Matte & Gloss Textures with Tactile Depth",
    description:
      "Advanced UV drip-off coating that adds contrast, depth and a premium finish to printed materials.",
    badge: "Tactile Texture",
    accentColor: "#FF007A",
    features: [
      "Simultaneous inline application of matte varnish and high-gloss UV",
      "Exceptional microscopic texture differential that can be felt by touch",
      "Enhanced scratch and scuff resistance for long shelf life",
      "Precision registration aligning coating exactly to graphic elements",
    ],
    applications: [
      "Corporate Brochures & Annual Reports",
      "Premium Brand Product Catalogues",
      "Luxury Outer Packaging & Sleeve Covers",
      "Distinctive Book Covers & Presentation Folders",
    ],
    finishEffect: "drip-off",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "multicolor-printing",
    num: "03",
    name: "Multicolor Printing",
    headline: "Vibrant Color Reproduction, Sharp Detail & Flawless Consistency",
    description:
      "High-quality multicolor printing with precise reproduction, vibrant results and consistent output.",
    badge: "Core Capability",
    accentColor: "#FFD600",
    features: [
      "High-speed multi-unit offset sheetfed printing press lines",
      "Ultra-fine halftone screen dot reproduction for smooth gradients",
      "Dynamic in-line densitometry color control across high-volume runs",
      "Broad substrate compatibility from lightweight paper to heavy boxboard",
    ],
    applications: [
      "Product Catalogues & Multi-page Brochures",
      "Custom Retail Packaging & Display Cartons",
      "Marketing Collateral, Posters & Flyers",
      "Corporate Stationery & B2B Publications",
    ],
    finishEffect: "multicolor",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "thermal-ctp",
    num: "04",
    name: "Thermal CTP",
    headline: "Computer-to-Plate Precision Laser Pre-Press Systems",
    description:
      "Thermal Computer-to-Plate technology supporting accurate plate production and reliable print quality.",
    badge: "Pre-Press Precision",
    accentColor: "#38BDF8",
    features: [
      "Thermal infrared laser imaging for microscopic dot sharpness",
      "Elimination of film processing chemistry and optical distortion errors",
      "Exact geometric plate registration for immediate press makeready",
      "Consistent repeatable calibration across repeat corporate orders",
    ],
    applications: [
      "High-Resolution Pre-Press Plate Output",
      "Fine Line Artwork & Micro-Text Clarity",
      "High-Volume Run Plate Durability",
      "Tight Multi-Color Registration Alignment",
    ],
    finishEffect: "ctp",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
  },
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: "20+ Years of Experience",
    description:
      "Decades of experience in the printing industry and an understanding of professional business printing requirements.",
    icon: "ShieldCheck",
    tag: "Established Heritage",
  },
  {
    title: "Quality Focused",
    description:
      "Every project is approached with attention to detail and consistency across high-volume commercial press runs.",
    icon: "Target",
    tag: "High Standards",
  },
  {
    title: "Modern Printing Technology",
    description:
      "Use of professional printing and pre-press technologies including Thermal CTP and advanced UV coating lines.",
    icon: "Cpu",
    tag: "Advanced Tech",
  },
  {
    title: "Customized Solutions",
    description:
      "Printing solutions tailored to the specific requirements of each client, from custom die-cuts to specialty Met-Pet finishes.",
    icon: "Sliders",
    tag: "Bespoke Delivery",
  },
  {
    title: "Reliable Service",
    description:
      "A professional approach focused on delivering dependable results, strict timelines, and transparent communication.",
    icon: "Clock",
    tag: "On-Time Dispatch",
  },
  {
    title: "Business-Focused Printing",
    description:
      "Solutions designed for companies, brands and organizations that need professional printed materials that leave a lasting impression.",
    icon: "Building2",
    tag: "B2B Credibility",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discuss Your Requirements",
    description:
      "We understand your printing needs, target quantities, substrate specifications, budget, and finishing requirements.",
    icon: "MessageSquare",
  },
  {
    step: "02",
    title: "Prepare Your Artwork",
    description:
      "Artwork inspection for color gamuts (CMYK), bleed parameters, vector alignments, and high-resolution typography.",
    icon: "FileCheck",
  },
  {
    step: "03",
    title: "Pre-Press & Plate Preparation",
    description:
      "Direct imaging using Thermal CTP systems, generating razor-sharp printing plates with perfect registration.",
    icon: "Layers",
  },
  {
    step: "04",
    title: "Professional Offset Printing",
    description:
      "High-speed offset press execution with precise ink-water balance, consistent color density, and Met-Pet capabilities.",
    icon: "Printer",
  },
  {
    step: "05",
    title: "Finishing & Quality Check",
    description:
      "UV drip-off, aqueous coating, precision die-cutting, folding, and thorough sheet-by-sheet inspection.",
    icon: "Sparkles",
  },
  {
    step: "06",
    title: "Ready for Delivery",
    description:
      "Secure industrial packing, moisture protection, and scheduled dispatch directly to your business facility.",
    icon: "Truck",
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Premium Cosmetic & Pharma Cartons",
    category: "packaging",
    categoryLabel: "Packaging",
    description: "High-grade mono-cartons with precision crease-lines and vibrant multicolor branding.",
    finishTag: "Multicolor Offset",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "g2",
    title: "Met-Pet Metallic Luxury Packaging",
    category: "met-pet",
    categoryLabel: "Met-Pet & Specialty",
    description: "Reflective metallic substrate printing with opaque white backing for striking visual depth.",
    finishTag: "Met-Pet Foil Finish",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "g3",
    title: "Corporate Multi-Page Catalogues",
    category: "brochures",
    categoryLabel: "Brochures & Catalogues",
    description: "Heavyweight coated paper catalogues with spot UV drip-off highlights on cover sheets.",
    finishTag: "UV Drip-Off + Stitching",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "g4",
    title: "Industrial Product Manuals & Folders",
    category: "stationery",
    categoryLabel: "Business Stationery",
    description: "Crisp vector reproduction and durable lamination for manufacturing and machinery clients.",
    finishTag: "Precision Thermal CTP",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "g5",
    title: "FMCG High-Volume Food Packaging",
    category: "packaging",
    categoryLabel: "Packaging",
    description: "Food-grade certified paperboard printing with batch-consistent color calibration.",
    finishTag: "4-Color Process",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "g6",
    title: "Architectural & Real Estate Folders",
    category: "brochures",
    categoryLabel: "Brochures & Catalogues",
    description: "Gatefold presentation brochures with soft-touch matte finish and gloss UV accents.",
    finishTag: "UV Drip-Off Finish",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "g7",
    title: "Brand Identity & Corporate Stationery",
    category: "stationery",
    categoryLabel: "Business Stationery",
    description: "Letterheads, visiting cards, presentation folders, and security watermarked papers.",
    finishTag: "Offset Stationery",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "g8",
    title: "High-Gamut Multicolor Marketing Sheets",
    category: "multicolor",
    categoryLabel: "Multicolor Commercial",
    description: "Stunning color fidelity and smooth gradients printed on ultra-white coated art paper.",
    finishTag: "Multicolor Offset",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop",
  },
];
