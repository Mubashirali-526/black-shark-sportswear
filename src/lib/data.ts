export const BRAND = {
  name: "Black Shark",
  tagline: "Engineered for Champions",
  phone: "+92 337 0488235",
  whatsapp: "923370488235",
  email: "bsuniforms7@gmail.com",
  address: "Neka Pura Shahjahan Road, Sialkot, Pakistan",
  founded: 2012,
};

export function whatsappLink(message: string) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

const p = (id: number, w = 800, h = 1100) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;
const l = (id: number, w = 1200, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const heroSlides = [
  {
    id: 1,
    src: "/hero1.png",
    preTitle: "Collection 01",
    headline: "ENGINEERED",
    headlineSub: "FOR CHAMPIONS",
    headlineEnd: "WORLDWIDE",
    desc: "Premium football kits manufactured in Sialkot. Full sublimation, custom branding, delivered to 40+ countries.",
    target: "team-uniforms",
  },
  {
    id: 2,
    src: "/hero2.png",
    preTitle: "Collection 02",
    headline: "CRAFTED",
    headlineSub: "FOR THE",
    headlineEnd: "CRICKET FIELD",
    desc: "Premium cricket whites and colored kits. Custom sublimation, team branding and fast global delivery.",
    target: "team-uniforms",
  },
  {
    id: 3,
    src: "/hero3.png",
    preTitle: "Collection 03",
    headline: "BUILT FOR",
    headlineSub: "COMBAT",
    headlineEnd: "CHAMPIONS",
    desc: "Professional boxing shorts, MMA gear, rash guards and walkout jackets — engineered for fighters.",
    target: "gloves",
  },
  {
    id: 4,
    src: "/hero4.png",
    preTitle: "Collection 04",
    headline: "UNITED",
    headlineSub: "AS ONE",
    headlineEnd: "TEAM",
    desc: "Custom basketball jerseys and team uniforms with full sublimation print and zero minimum restrictions.",
    target: "team-uniforms",
  },
];

export type Category = {
  slug: string;
  name: string;
  count: number;
  image: string;
  blurb: string;
  placeholder?: boolean;
};

export const categories: Category[] = [
  {
    slug: "team-uniforms",
    name: "Team Uniforms",
    count: 45,
    image: "/categories/team-uniforms/teamwear-hero.png",
    blurb: "Full custom kits for clubs, schools and academies worldwide.",
  },
  {
    slug: "activewear",
    name: "Activewear",
    count: 38,
    image: "/categories/activewear/active-hero.png",
    blurb: "Studio and performance activewear collection",
  },
  {
    slug: "sublimation-wear",
    name: "Sublimation Wear",
    count: 42,
    image: "/categories/sublimation-wear/sublimation-hero.png",
    blurb: "Full sublimation sportswear collection",
  },
  {
    slug: "youth-sportswear",
    name: "Youth Sportswear",
    count: 20,
    image: "/categories/youth-sportswear.png",
    blurb: "Custom sportswear for junior athletes",
  },
  {
    slug: "boxing-gloves",
    name: "Gloves",
    count: 15,
    image: "/categories/boxing-gloves.png",
    blurb: "Professional grade custom boxing gloves",
  },
  {
    slug: "bags",
    name: "Bags",
    count: 18,
    image: "/categories/bags.png",
    blurb: "Custom team bags and backpacks",
  },
  {
    slug: "accessories-apparel",
    name: "Accessories & Apparel",
    count: 12,
    image:
      "https://images.pexels.com/photos/5325105/pexels-photo-5325105.jpeg?auto=compress&cs=tinysrgb&w=800",
    blurb: "Custom caps, socks, hoodies, jackets, tees and complete team apparel accessories.",
  },
];

export type CategoryProduct = {
  id?: string;
  slug?: string;
  name: string;
  image: string;
  fabric?: string;
  description: string;
  tags?: string[];
  position?: string;
};

export const categoryProducts: Record<string, CategoryProduct[]> = {
  "team-uniforms": [],
  "activewear": [],
  "sublimation-wear": [],
  "youth-sportswear": [],
  "boxing-gloves": [],
  "bags": [],
  "accessories-apparel": [],
};

export const categorySubcategories: Record<string, string[]> = {
  "team-uniforms": [
    "Football", "Cricket", "Basketball", "Hockey",
    "Rugby", "Baseball", "Volleyball", "Kabaddi"
  ],
  "activewear": [
    "Women's Activewear", "Men's Activewear", "Compression Wear",
    "Sports Bra & Tops", "Leggings & Tights", "Training Shorts",
    "Tank Tops & Stringers", "Tracksuits", "Yoga & Pilates Wear", "Swim Wear"
  ],
  "sublimation-wear": [
    "Football Kit Sublimation", "Cricket Kit Sublimation",
    "Basketball Jersey Sublimation", "Hockey Kit Sublimation",
    "MMA & Boxing Sublimation"
  ],
  "youth-sportswear": [
    "Boys Sportswear", "Girls Sportswear", "Kids Football Kits",
    "Junior Cricket Whites", "Youth Basketball Jerseys"
  ],
  "boxing-gloves": [
    "Boxing Gloves", "MMA Gloves", "Sparring Gloves",
    "Bag Gloves", "Training Mitts"
  ],
  "bags": [
    "Kit Bags", "Backpacks", "Drawstring Bags",
    "Duffel Bags", "Gym Bags"
  ],
  "accessories-apparel": [
    "Caps & Hats", "Socks", "Hoodies",
    "Jackets", "T-Shirts", "Shorts"
  ],
};

export type Sport = { name: string; icon: string; slug: string };
export const sports: Sport[] = [
  { name: "Soccer", icon: "⚽", slug: "soccer" },
  { name: "Cricket", icon: "🏏", slug: "cricket" },
  { name: "Basketball", icon: "🏀", slug: "basketball" },
  { name: "Rugby", icon: "🏉", slug: "rugby" },
  { name: "Boxing", icon: "🥊", slug: "boxing" },
  { name: "MMA", icon: "🥋", slug: "mma" },
  { name: "Hockey", icon: "🏑", slug: "hockey" },
  { name: "Cycling", icon: "🚴", slug: "cycling" },
  { name: "Running", icon: "🏃", slug: "running" },
  { name: "Baseball", icon: "⚾", slug: "baseball" },
  { name: "Volleyball", icon: "🏐", slug: "volleyball" },
  { name: "Tennis", icon: "🎾", slug: "tennis" },
  { name: "Athletics", icon: "🏅", slug: "athletics" },
  { name: "Gym & Fitness", icon: "💪", slug: "gym-fitness" },
];

export type Product = {
  slug: string;
  name: string;
  sku?: string;
  productId?: string;
  category: string;
  categorySlug: string;
  sport: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  tags?: string[];
  position?: string;
  badge?: "New" | "Best Seller" | "Sale";
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  specs: { label: string; value: string }[];
};

const commonColors = [
  { name: "Onyx Black", hex: "#0b0b0b" },
  { name: "Pure White", hex: "#ffffff" },
  { name: "Steel Grey", hex: "#8a8f98" },
  { name: "Shark Blue", hex: "#1e3a5f" },
];
const commonSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const baseSpecs = [
  { label: "Fabric", value: "180 GSM Recycled Poly-Interlock" },
  { label: "Fit", value: "Athletic / Regular" },
  { label: "Print", value: "Full Sublimation" },
  { label: "MOQ", value: "20 pieces" },
  { label: "Lead Time", value: "15 days" },
  { label: "Origin", value: "Made in Pakistan" },
];

/** Standalone demo product for testing the product detail page — always
 * resolvable at /products/pro-football-jersey-set regardless of DB state. */
export const demoProduct: Product = {
  name: "Pro Football Jersey Set",
  productId: "BS-TU-000",
  category: "Team Uniforms",
  categorySlug: "team-uniforms",
  slug: "pro-football-jersey-set",
  sport: "Soccer",
  description:
    "Premium custom football jersey and shorts set with full sublimation print. Laser-cut ventilation zones and 4-way stretch fabric keep you cool through 90 minutes. Fully customizable colors, crests and numbers.",
  tags: ["Football", "Sublimation", "Custom Kit", "Team Uniform"],
  images: [
    "/categories/team-uniforms/subcategories/football.jpg",
    "/categories/team-uniforms/teamwear-hero.png",
    "/categories/team-uniforms/subcategories/cricket.jpg",
    "/categories/team-uniforms/subcategories/basketball.jpg",
  ],
  rating: 4.9,
  reviews: 214,
  price: 0,
  colors: [
    { name: "Onyx Black", hex: "#0b0b0b" },
    { name: "Pure White", hex: "#ffffff" },
    { name: "Royal Blue", hex: "#1e3a8a" },
    { name: "Gold", hex: "#C9A84C" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
  specs: [
    { label: "Fabric", value: "180 GSM Recycled Poly-Interlock" },
    { label: "Fit", value: "Athletic / Regular" },
    { label: "Print", value: "Full Sublimation" },
    { label: "MOQ", value: "20 pieces" },
    { label: "Lead Time", value: "15 days" },
    { label: "Origin", value: "Made in Pakistan" },
  ],
};

export const products: Product[] = [
];

export const manufacturingImages = {
  wide: l(17710109, 1600, 900),
  worker:
    "https://images.unsplash.com/photo-1742280921537-65b99d6e7458?auto=format&fit=crop&w=800&h=1067&q=80",
  machines:
    "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&h=1067&q=80",
  cutting: l(31091544),
  quality: l(31047138),
  yarn: l(8246482),
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};
export const testimonials: Testimonial[] = [
  {
    name: "Joseph Fresco",
    role: "USA Rugby, National Team Manager",
    quote:
      "Black Shark produced 240 fully custom rugby kits in under three weeks without a single quality issue. The stitching held up through our entire training camp.",
    rating: 5,
  },
  {
    name: "Kynaibefit Okonkwo",
    role: "European Basketball League, Head of Operations",
    quote:
      "We needed reversible jerseys for eight club teams before the season opener. Black Shark hit every deadline and the fabric breathes even under stadium lights.",
    rating: 5,
  },
  {
    name: "Mr Larry",
    role: "USA Track & Field, Club Director",
    quote:
      "Our athletes needed lightweight kits that wouldn't weigh them down at nationals. The moisture-wicking fabric and sublimation quality beat what we were paying double for locally.",
    rating: 5,
  },
  {
    name: "Humera Khan",
    role: "Owner, Pulse Fitness Studios, Dubai, UAE",
    quote:
      "Our branded activewear line sold out within two drops. The fabric feels premium, the manufacturing is ethical, and the margins actually work for a small studio like ours.",
    rating: 5,
  },
  {
    name: "Romero Sergio",
    role: "Mexico City Football Club, Head of Merchandising",
    quote:
      "We switched suppliers mid-season and Black Shark still delivered our full squad kit on time. The heavier GSM fabric survived a full contact season without fading.",
    rating: 5,
  },
];

export type Faq = { q: string; a: string };
export const faqs: Faq[] = [
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: "Our standard MOQ is 20 pieces per design for fully custom sublimated products. Accessories and blank stock have lower minimums — contact us for specifics.",
  },
  {
    q: "How long does production take?",
    a: "Standard lead time is 15 days after you approve the digital proof. Rush production is available for time-critical tournaments.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We export to over 40 countries with door-to-door courier and freight options. Duties and delivery windows are confirmed at quotation.",
  },
  {
    q: "Can I get a sample before a bulk order?",
    a: "Absolutely. We offer paid pre-production samples and free sizing kits so your team can confirm fit and quality before full production begins.",
  },
  {
    q: "What file formats do you need for artwork?",
    a: "Vector files (AI, EPS, PDF, or SVG) give the best results. We also accept high-resolution PNGs. Our design team can recreate artwork if needed.",
  },
  {
    q: "Do you offer design services?",
    a: "Yes — every order includes a free design consultation and digital proof. Our in-house studio can build your kit from a logo or a rough sketch.",
  },
  {
    q: "What payment terms do you offer?",
    a: "For custom orders we typically require a 50% deposit to begin production with the balance due before dispatch. Established partners can arrange trade terms.",
  },
  {
    q: "Are your products ethically manufactured?",
    a: "Yes. Our facility is audited for fair wages and safe conditions, and we use recycled fabrics and low-impact inks wherever possible.",
  },
];

export const whyChoose = [
  { title: "Full Custom Design", desc: "In-house studio turns your idea into a game-ready kit with free digital proofs.", icon: "PenTool" },
  { title: "Premium Fabrics", desc: "Recycled performance textiles engineered for breathability and durability.", icon: "Layers" },
  { title: "Low MOQ", desc: "Start from just 20 pieces — perfect for clubs, academies and startups.", icon: "PackageCheck" },
  { title: "Fast Global Shipping", desc: "Door-to-door export to 40+ countries with reliable tracking.", icon: "Truck" },
  { title: "Ethical Manufacturing", desc: "Audited facility, fair wages, and low-impact production processes.", icon: "ShieldCheck" },
  { title: "Dedicated Support", desc: "A single account manager from first sketch to final delivery.", icon: "Headphones" },
];

export const processSteps = [
  { step: "01", title: "Consultation & Design", desc: "Share your vision. Our studio returns a free digital proof within 48 hours.", image: "/manufacturing/consultation.png" },
  { step: "02", title: "Fabric & Sampling", desc: "Select performance fabrics and approve a pre-production sample.", image: "/manufacturing/fabric-sampling.png" },
  { step: "03", title: "Precision Production", desc: "Computer-cut panels, sublimation and expert stitching at scale.", image: "/manufacturing/precision-production.png" },
  { step: "04", title: "QC & Global Delivery", desc: "Every piece inspected, packed and shipped door-to-door worldwide.", image: "/manufacturing/qc-delivery.png" },
];

export const stats = [
  { value: "500+", label: "Orders Delivered" },
  { value: "40+", label: "Countries Served" },
  { value: "13+", label: "Years Manufacturing" },
  { value: "100%", label: "On-Time Delivery" },
];
