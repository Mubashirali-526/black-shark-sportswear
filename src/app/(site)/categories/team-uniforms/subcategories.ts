export type Subcategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  position?: string;
};

export const subcategories: Subcategory[] = [
  {
    name: "Football / Soccer",
    slug: "football",
    description:
      "Elite sublimated match jerseys, mesh panels, goalie protective gear and durable technical team socks.",
    image: "/categories/team-uniforms/subcategories/football.jpg",
  },
  {
    name: "Cricket",
    slug: "cricket",
    description:
      "Premium cricket whites and colored kits, trousers, training shirts, caps and team jackets built for all formats.",
    image: "/categories/team-uniforms/subcategories/cricket.jpg",
  },
  {
    name: "Boxing & MMA",
    slug: "boxing-mma",
    description:
      "Championship boxing shorts, robes, rash guards, compression shirts and custom walkout jackets.",
    image: "/categories/team-uniforms/subcategories/boxing-mma.jpg",
  },
  {
    name: "Basketball",
    slug: "basketball",
    description:
      "Vests, loose fit game shorts, and customizable jerseys built for full range of motion and breathability.",
    image: "/categories/team-uniforms/subcategories/basketball.jpg",
    position: "object-top",
  },
  {
    name: "Rugby",
    slug: "rugby",
    description:
      "Premium rugby teamwear built for strength, contact and high-performance play with breathable durable fabrics.",
    image: "/categories/team-uniforms/subcategories/rugby.jpg",
  },
  {
    name: "Baseball & Softball",
    slug: "baseball-softball",
    description:
      "Customizable button-down jerseys, dual-layer padded sliders and team jackets for diamond sports.",
    image: "/categories/team-uniforms/subcategories/baseball.jpg",
  },
  {
    name: "Volleyball",
    slug: "volleyball",
    description:
      "Premium volleyball teamwear designed for comfort, flexibility and high-performance play with lightweight fabrics.",
    image: "/categories/team-uniforms/subcategories/volleyball.png",
  },
  {
    name: "Martial Arts",
    slug: "martial-arts",
    description:
      "Premium Gi, no-gi shorts, rash guards, compression pants and custom belts for all martial arts disciplines.",
    image: "/categories/team-uniforms/subcategories/martial-arts.jpg",
  },
  {
    name: "Athletics / Running",
    slug: "athletics-running",
    description:
      "Lightweight running singlets, shorts, tights, tracksuits and windbreakers engineered for speed and comfort.",
    image: "/categories/team-uniforms/subcategories/athletics.jpg",
  },
  {
    name: "Gym & Fitness",
    slug: "gym-fitness",
    description:
      "Performance shorts, tanks, compression wear, hoodies and joggers for serious gym athletes and fitness brands.",
    image: "/categories/team-uniforms/subcategories/gym-fitness.jpg",
    position: "object-bottom",
  },
  {
    name: "Hockey",
    slug: "hockey",
    description:
      "Premium field hockey jerseys, shorts, skorts, tracksuits and team jackets for all levels of play.",
    image: "/categories/team-uniforms/subcategories/hockey.jpg",
  },
  {
    name: "Ice Hockey",
    slug: "ice-hockey",
    description:
      "Professional ice hockey jerseys, socks, training tops and team jackets built for the rink.",
    image: "/categories/team-uniforms/subcategories/ice-hockey.jpg",
  },
];
