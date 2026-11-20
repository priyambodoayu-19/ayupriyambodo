export interface VideoData {
  url: string;
  poster?: string;
  caption?: string;
  provider?: "direct" | "vimeo" | "youtube";
  aspectRatio?: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface SectionBackground {
  type: "color" | "image";
  color?: string; // e.g. "#FAF9F5", "#141413", "#F4F2EC"
  imageUrl?: string;
  overlayOpacity?: number; // 0 to 1
}

export interface CarouselSettings {
  autoplay?: boolean;
  intervalSeconds?: number;
  showArrows?: boolean;
  showDots?: boolean;
}

export interface ProjectSection {
  id: string;
  title: string;
  kicker?: string;
  description: string;
  type: "gallery" | "carousel" | "dieline" | "comparison" | "editorial" | "quote" | "video";
  fontSize?: "7xl" | "5xl" | "3xl" | "xl";
  spacing?: "compact" | "normal" | "generous";
  background?: SectionBackground;
  carouselSettings?: CarouselSettings;
  items?: {
    caption: string;
    subcaption?: string;
    image?: string;
    tag?: string;
    aspect?: string;
  }[];
  comparisonData?: {
    beforeLabel: string;
    afterLabel: string;
    beforeImage: string;
    afterImage: string;
    beforeDescription: string;
    afterDescription: string;
  };
  dielineData?: {
    substrate: string;
    dimensions: string;
    bleed: string;
    creaseGuide: string;
    finishes: string[];
    colorSeparation: string[];
  };
  videoData?: VideoData;
  quoteData?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  pillarNumber: string;
  pillarTitle: string;
  subtitle: string;
  category: string;
  year: string;
  role: string;
  client: string;
  status: string;
  summary: string;
  coverImage: string;
  aspectRatio?: string;
  tags: string[];
  metrics?: MetricItem[];
  videoData?: VideoData;
  overview: {
    challenge: string;
    strategicSolution: string;
    outcome: string;
  };
  deliverables: string[];
  specs?: {
    [key: string]: string;
  };
  sections: ProjectSection[];
}

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroData {
  badge: string;
  headlinePrefix: string;
  headlineItalic: string;
  headlineSuffix: string;
  subheadline: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  fontSize?: "7xl" | "5xl" | "3xl";
  spacing?: "compact" | "normal" | "generous";
  background?: SectionBackground;
}

export interface ToolchainItem {
  name: string;
  role: string;
}

export interface AboutPageData {
  badge: string;
  headline: string;
  subheading: string;
  storyParagraphs: string[];
  statusBoxTitle: string;
  statusBoxText: string;
  resumeButtonText: string;
  resumeUrl: string;
  contactButtonText: string;
  toolchainTitle: string;
  toolchainDescription: string;
  toolchain: ToolchainItem[];
}

export interface WorkSectionData {
  kicker: string;
  title: string;
  description: string;
}

export interface SiteMetadata {
  author: string;
  title: string;
  role: string;
  shortBio: string;
  location: string;
  email: string;
  availableForProjects: boolean;
  availabilityText: string;
  navLinks: NavLinkItem[];
  hero: HeroData;
  about: AboutPageData;
  workSection: WorkSectionData;
  socials: { name: string; url: string }[];
  capabilities: { category: string; skills: string[] }[];
}

export const DEFAULT_SITE_METADATA: SiteMetadata = {
  author: "Ayu Priyambodo",
  title: "Ayu Priyambodo — Creative Director & Brand Identity Designer",
  role: "Brand Identity Designer & Creative Director",
  shortBio:
    "Zero-to-one brand identity, manufacturing-ready packaging & print production, commercial art direction, and executive editorial systems.",
  location: "Jakarta, Indonesia / Remote Worldwide",
  email: "hello@ayupriyambodo.com",
  availableForProjects: true,
  availabilityText: "Available for Select Projects",
  navLinks: [
    { id: "work", label: "Work", href: "/#work" },
    { id: "pillars", label: "Pillars", href: "/#pillars" },
    { id: "about", label: "About", href: "/about" },
    { id: "contact", label: "Contact", href: "/#contact" },
  ],
  hero: {
    badge: "CREATIVE DIRECTION & BRAND IDENTITY PORTFOLIO",
    headlinePrefix: "Translating zero-to-one concepts into",
    headlineItalic: "shelf-ready systems",
    headlineSuffix: ", commercial campaigns, & executive editorial.",
    subheadline:
      "I partner with ambitious brand founders, creative directors, and executive teams to build enduring visual worlds—from raw botanical formulation concepts and factory pre-press dielines to high-impact launch films and bilingual investor publications.",
    primaryButtonText: "Explore Featured Work",
    primaryButtonLink: "#work",
    secondaryButtonText: "Read Profile & Approach",
    secondaryButtonLink: "/about",
  },
  workSection: {
    kicker: "Core Curated Portfolio",
    title: "The Four Pillars",
    description:
      "Every angle required by design directors, brand managers, and lead recruiters: from zero-to-one design systems and manufacturing specs to commercial film and bilingual publications.",
  },
  about: {
    badge: "Profile & Perspective",
    headline: "Designing with aesthetic authority & manufacturing rigor.",
    subheading:
      "Bridging the gap between zero-to-one brand storytelling and real-world physical manufacturing.",
    storyParagraphs: [
      "Hello. I’m Ayu Priyambodo, a Creative Director and Brand Identity Designer based in Jakarta, partnering with boutique founders and global enterprise leaders worldwide.",
      "My practice is organized around a simple truth: the most impactful brands succeed not because of surface-level trends, but because their visual and structural systems are deeply coherent from concept to factory press.",
      "Whether building a zero-to-one botanical skincare world like NIDHI, calculating 2-point score rules and glue-tab knockouts for complex carton packaging, directing atmospheric commercial launch films with Arri Alexa cinematography, or balancing bilingual typography for boardroom annual reports—I treat every touchpoint with obsessive editorial discipline.",
      "This end-to-end perspective allows me to act as both a strategic creative partner to brand executives and a trusted technical collaborator on the manufacturing floor.",
    ],
    statusBoxTitle: "Current Status",
    statusBoxText:
      "Accepting select brand identity, packaging design, and creative direction engagements for Q3/Q4.",
    resumeButtonText: "Download Curriculum Vitae",
    resumeUrl: "#resume",
    contactButtonText: "Initiate a Conversation",
    toolchainTitle: "Software & Toolchain Fluency",
    toolchainDescription:
      "Operating with precision across industry-standard publishing, vector geometry, pre-press profiling, and color grading suites.",
    toolchain: [
      { name: "Adobe InDesign", role: "Long-form editorial, bilingual grid pagination, bookbinding" },
      { name: "Adobe Illustrator", role: "Vector dielines, logotype drawing, packaging geometry" },
      { name: "Adobe Photoshop", role: "High-end retouching, pre-press CMYK profiling, key visuals" },
      { name: "Figma", role: "Design systems, typography scale tokens, responsive layouts" },
      { name: "CAD / ArtiosCAD", role: "2D packaging dielines, folding tolerances, structural design" },
      { name: "DaVinci Resolve", role: "Color grading (LUTs), commercial edit supervision, film delivery" },
    ],
  },
  socials: [
    { name: "LinkedIn", url: "https://linkedin.com/in/ayupriyambodo" },
    { name: "Behance", url: "https://behance.net/ayupriyambodo" },
    { name: "Instagram", url: "https://instagram.com/ayupriyambodo" },
    { name: "Savee / Readymag", url: "https://savee.it" }
  ],
  capabilities: [
    {
      category: "Brand Systems & Identity",
      skills: [
        "Zero-to-One Brand Worlds",
        "Visual Identity Guidelines",
        "Typography & Color Hierarchies",
        "Label Architecture & Shelf Cohesion",
        "Custom Wordmarks & Iconography"
      ]
    },
    {
      category: "Packaging & Technical Pre-Press",
      skills: [
        "2D Precision Dielines",
        "Pre-Press & CMYK / Spot Pantone Profiling",
        "Foil Stamping, Embossing & Debossing Specs",
        "Substrate Curation (Kraft, SBS, Frosted Glass)",
        "Factory-Floor Manufacturing QC"
      ]
    },
    {
      category: "Art Direction & Motion",
      skills: [
        "Campaign Visual Manifestos",
        "Lighting & Color Grading Direction",
        "Set & Prop Styling Direction",
        "Storyboard to Commercial Launch Video",
        "E-Commerce & High-Impact Stills"
      ]
    },
    {
      category: "Editorial & Corporate Systems",
      skills: [
        "Bilingual Editorial Grids (EN / ID)",
        "Executive B2B Storytelling",
        "Annual Reports & Company Profiles",
        "Complex Catalog Layouts",
        "Data Visualization & Information Architecture"
      ]
    }
  ]
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "pillar-1",
    slug: "nidhi",
    pillarNumber: "01",
    pillarTitle: "Brand Identity & Zero-to-One System",
    title: "NIDHI",
    subtitle: "Complete Minimalist Skincare Brand World & Packaging Architecture",
    category: "Brand Identity / Brand World",
    year: "2024",
    role: "Lead Brand Designer & System Architect",
    client: "Nidhi Botanical Skincare",
    status: "Completed / In Market",
    summary:
      "A complete zero-to-one identity system for a botanical skincare brand. Spanning custom typography hierarchy, nuanced earth-mineral color systems, regulatory label anatomy, and unified shelf presence across 5 core formulation SKUs.",
    coverImage: "/placeholder-nidhi-hero.svg",
    aspectRatio: "16/9",
    tags: ["Brand World", "Zero-to-One", "Skincare", "Design System", "Art Direction"],
    metrics: [
      { label: "Core SKUs Launched", value: "5 Formulations" },
      { label: "Packaging Formats", value: "Bottles, Tins, Jars, Cartons" },
      { label: "Brand Guidelines Volume", value: "88-Page Standard" }
    ],
    overview: {
      challenge:
        "The clean beauty and botanical skincare sector is crowded with uniform pastel aesthetics that fail to establish shelf authority or articulate clinical botanic efficacy. NIDHI required an authoritative yet calming visual universe that bridges botanical raw materials with precise dermatology standards.",
      strategicSolution:
        "Crafted a bespoke identity rooted in understated tactile luxury: an architectural custom serif wordmark balanced with high-efficiency grotesk typography for ingredients and certifications. Formulated a pigment-tested chromatic palette derived from botanical extracts (Lichen, Silt, Warm Alabaster, and Raw Obsidian) and built a rigid label grid that scales seamlessly from 15ml eye-droppers to 250ml secondary folding boxes.",
      outcome:
        "NIDHI established immediate retail presence across boutique lifestyle apothecaries and premium e-commerce channels with 100% packaging consistency across all initial production batches."
    },
    deliverables: [
      "Full Zero-to-One Visual Identity",
      "Custom Wordmark & Monogram Seal",
      "Packaging Design System (5 SKUs + Secondary Cartons)",
      "Bespoke Label Hierarchy Grid & Compliance Layouts",
      "Unboxing Architecture & Protective Inserts",
      "88-Page Brand & Packaging Guidelines Manual"
    ],
    specs: {
      "Primary Typography": "Bespoke Editorial High-Contrast Serif + Suisse Int'l Grotesk",
      "Color Palette": "Raw Obsidian (#141413), Warm Alabaster (#F7F5F0), Lichen Sage (#8A9284), Silt Umber (#4A443E)",
      "Primary Substrates": "Matte Frosted Borosilicate Glass, Recycled Aluminium Caps",
      "Secondary Packaging": "350gsm FSC Certified Unbleached Kraftboard with Blind Deboss"
    },
    sections: [
      {
        id: "visual-system",
        title: "The Zero-to-One System Architecture",
        kicker: "System Foundations",
        description:
          "The identity is built upon an unyielding mathematical grid. Label information is stratified into three distinct visual tiers: Botanical Identification, Active Compound Concentration, and Rigorous Usage Instructions.",
        type: "gallery",
        items: [
          {
            caption: "Logotype Anatomy & Kerning Matrix",
            subcaption: "Drawn with bespoke ligature transitions echoing stem botanicals.",
            aspect: "4/3"
          },
          {
            caption: "Chromatic Mineral Matrix",
            subcaption: "Calibrated for both natural ambient daylight and low-lit retail shelving.",
            aspect: "4/3"
          },
          {
            caption: "Modular Label Grid System",
            subcaption: "Scalable across cylindrical, conical, and rectangular packaging profiles.",
            aspect: "4/3"
          }
        ]
      },
      {
        id: "shelf-cohesion",
        title: "Shelf Cohesion & Multi-SKU Hierarchy",
        kicker: "Retail Impact",
        description:
          "Ensuring the five formulations feel like a singular harmonious family while allowing customers to immediately distinguish cleanser, balancing toner, barrier repair cream, restorative oil, and night treatment.",
        type: "gallery",
        items: [
          {
            caption: "The 5-SKU Family Shelf Lineup",
            subcaption: "Unified baseline alignment and graduated color-coded botanical seals.",
            aspect: "16/9"
          },
          {
            caption: "Secondary Folding Box Unboxing Flow",
            subcaption: "Hidden interior poetic manifesto revealed upon breaking the tamper seal.",
            aspect: "4/3"
          }
        ]
      }
    ]
  },
  {
    id: "pillar-2",
    slug: "packaging-production",
    pillarNumber: "02",
    pillarTitle: "Packaging & Print Production",
    title: "Packaging & Print Production",
    subtitle: "Precision 2D Dielines, Substrate Curation & Factory Pre-Press Readiness",
    category: "Technical Packaging / Pre-Press",
    year: "2024",
    role: "Packaging Engineer & Production Art Director",
    client: "Select Retail & Luxury Packaging Clients",
    status: "Production Verified",
    summary:
      "A deep demonstration of structural packaging rigor: from CAD dielines, fold lines, and bleed compensation to spot Pantone ink separations, foil stamp registrations, and paperboard fiber grain direction.",
    coverImage: "/placeholder-packaging-hero.svg",
    aspectRatio: "16/9",
    tags: ["Dielines", "Pre-Press", "Print Production", "Foil Stamping", "Material Finishes"],
    metrics: [
      { label: "Manufacturing Tolerance", value: "±0.5mm Precision" },
      { label: "Finishing Techniques", value: "Blind Deboss, Foil, Soft-Touch" },
      { label: "Ink Channels", value: "CMYK + 2 Spot Pantones" }
    ],
    overview: {
      challenge:
        "Many digital designs disintegrate when sent to press due to unaccounted paper caliper thickness, improper glue-tab tolerances, misalignment of embossing dies, or illegible micro-typography on curved containers.",
      strategicSolution:
        "Engineered production-grade 2D vector dielines factoring in exact paper caliper (pt/gsm), glue flaps with anti-varnish knockouts, and creep allowances for nested multi-panel folds. Authored detailed print-finishing maps designating registration marks, foil stamping channels, and Pantone Spot ink formulations.",
      outcome:
        "Zero press downtime, flawless die-cutting registration across thousands of units, and pristine structural integrity without cracking along the score lines."
    },
    deliverables: [
      "Engineered 2D Vector Dielines (DXF / AI / PDF)",
      "Finishing Spec Layers (Deboss, Foil, Spot UV Knockouts)",
      "Pre-Flight Print Guides & Color Separation Protocols",
      "Material Spec Sheets (Grain Direction, Caliper, Tensile Strength)",
      "Vendor Proofing & Press-Check Quality Control Sign-Off"
    ],
    specs: {
      "Carton Substrate": "350 gsm C1S Bleached Sulfate Board & E-Flute Corrugated",
      "Color Standards": "ISO 12647-2 / GRACoL 2013 Coated Profile",
      "Foil Spec": "Kurz Luxor 388 Architectural Micro-Metallic Warm Gold",
      "Dieline Crease Rule": "2-Point Score Rule with calibrated creasing matrix"
    },
    sections: [
      {
        id: "dieline-breakdown",
        title: "The Anatomy of a Production-Ready Dieline",
        kicker: "Engineering Rigor",
        description:
          "Inspecting every vector layer: cut lines, perforation scores, glue flaps, bleed boundaries, and varnish-free zones for machine adhesives.",
        type: "dieline",
        dielineData: {
          substrate: "350gsm C1S Premium Ivory Board",
          dimensions: "Flat: 285mm × 210mm | Assembled: 70mm × 70mm × 145mm",
          bleed: "3.0mm external bleed on all uncreased perimeters",
          creaseGuide: "Red: 100% Cut | Blue dashed: 50% Crease/Fold | Green: Adhesive Knockout",
          finishes: [
            "Matte Soft-Touch Protective Laminate",
            "Multi-Level Registered Blind Deboss (0.4mm depth)",
            "Precision Micro-Foil Stamping (Kurz 388)",
            "Spot Matte Varnish on typography"
          ],
          colorSeparation: [
            "Process Black (Text & Barcodes)",
            "Pantone Warm Gray 1 C (Background wash)",
            "Pantone 405 C (Accent borders)",
            "Foil Plate (Vector 100% K separation)"
          ]
        },
        items: [
          {
            caption: "2D Flat Vector Dieline with Registration Targets",
            subcaption: "Calibrated glue tab, dust flaps, and tuck-top locking mechanism.",
            aspect: "16/9"
          },
          {
            caption: "3D Render vs. Physical Production Press Check",
            subcaption: "True-to-life lighting verification under D50 5000K standard press booth lamps.",
            aspect: "16/9"
          }
        ]
      }
    ]
  },
  {
    id: "pillar-3",
    slug: "art-direction-campaign",
    pillarNumber: "03",
    pillarTitle: "Art Direction & Campaign Launch",
    title: "Art Direction & Campaign Launch",
    subtitle: "From Abstract Concept Moodboards to Commercial Launch Film",
    category: "Art Direction / Campaign Launch",
    year: "2024",
    role: "Creative Director & Art Lead",
    client: "Luxury Lifestyle & Skincare Campaign",
    status: "Aired / Global Digital Campaign",
    summary:
      "A showcase of high-level creative vision and execution: translating abstract moodboards, tactile textures, and cinematic lighting concepts into a cohesive commercial launch film and still campaign.",
    coverImage: "/placeholder-campaign-hero.svg",
    aspectRatio: "16/9",
    tags: ["Art Direction", "Commercial Video", "Moodboarding", "Set Design", "Campaign Launch"],
    metrics: [
      { label: "Assets Directed", value: "30s Hero Film + 6 Social Cutdowns" },
      { label: "Still Photography", value: "18 Editorial Key Visuals" },
      { label: "Campaign Reach", value: "Global Digital & Retail Display" }
    ],
    videoData: {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "/placeholder-campaign-hero.svg",
      caption: "Commercial Launch Film (30s Director's Cut) — Botanical Equilibrium & Mineral Restraint",
      provider: "direct",
      aspectRatio: "16/9"
    },
    overview: {
      challenge:
        "Translating an elusive brand ethos ('botanical equilibrium and raw mineral restraint') into concrete film direction that crew, lighting gaffers, set decorators, and videographers can execute flawlessly without ambiguity.",
      strategicSolution:
        "Created an exhaustive Pre-Production Treatment: chromatic lighting guides (raking low-angle golden hour mixed with cool overcast diffusers), custom mineral rock plinths, slow-motion fluid macro textures, and a frame-by-frame storyboard matching the musical score cadence.",
      outcome:
        "A seamless 2-day live-action production run that delivered the 30-second commercial hero film, six vertical platform cutdowns, and eighteen high-resolution still key visuals with exact thematic cohesion."
    },
    deliverables: [
      "Comprehensive Director's Treatment & Moodboard",
      "Commercial Launch Film (30s Master + Social Edits)",
      "Lighting & Texture Blueprint (Light Ratios, Gels, Diffusion)",
      "Set Architecture, Prop Sourcing & Plinth Fabrication",
      "Shot List, Storyboard & Timing Metronome",
      "On-Set Creative Direction & Live Monitor Supervision",
      "Color Grading (LUT) Supervision & Post-Production QC"
    ],
    specs: {
      "Capture Medium": "Arri Alexa Mini LF + Cooke Anamorphic /i Prime Lenses",
      "Aspect Ratios": "2.39:1 Cinema Master & 9:16 Social Cutdowns",
      "Color Grade": "Kodak 2383 Film Print Emulation with softened highlight roll-off",
      "Lighting Profile": "High-diffusion overhead sky-panel with hard tungsten raking edge"
    },
    sections: [
      {
        id: "moodboard-to-reality",
        title: "The Translation: Concept Moodboard → Final Frame",
        kicker: "Visual Synthesis",
        description:
          "Demonstrating how references of raw volcanic basalt, early morning mist, and tactile droplets transformed into commercial hero shots.",
        type: "comparison",
        comparisonData: {
          beforeLabel: "Phase 01: Concept Moodboard & Lighting Test",
          afterLabel: "Phase 02: Final Graded Commercial Still",
          beforeImage: "/placeholder-moodboard.svg",
          afterImage: "/placeholder-final-frame.svg",
          beforeDescription:
            "Curated references establishing the lighting ratio: 3:1 key-to-fill, tactile stone props, and desaturated olive undertones.",
          afterDescription:
            "Final captured frame on set: custom wet basalt plinth, precision rim light catching the bottle's glass curvature, and atmospheric fog."
        }
      },
      {
        id: "campaign-film",
        title: "Commercial Film & Motion Sequence",
        kicker: "Motion Direction",
        description:
          "Rhythm, pacing, and macro liquid mechanics. Every second was storyboarded to highlight the tactile ritual of formulation application.",
        type: "editorial",
        items: [
          {
            caption: "Scene 01: The Mineral Awakening",
            subcaption: "Macro liquid droplet descent at 120fps with synchronized sound design.",
            aspect: "16/9"
          },
          {
            caption: "Scene 02: Packaging Silhouette Reveal",
            subcaption: "Slow panning light source grazing across the debossed wordmark.",
            aspect: "16/9"
          }
        ]
      }
    ]
  },
  {
    id: "pillar-4",
    slug: "editorial-decks",
    pillarNumber: "04",
    pillarTitle: "Corporate Decks & Editorial Systems",
    title: "Corporate Decks & Editorial Systems",
    subtitle: "Bilingual Company Profiles, Data Visualization & Catalog Architecture",
    category: "Editorial Design / Corporate Systems",
    year: "2023 - 2024",
    role: "Editorial Art Director & Information Designer",
    client: "B2B Enterprise & Institutional Partners",
    status: "Published & In Circulation",
    summary:
      "A demonstration of typography discipline and B2B clarity: engineering bilingual publication grids (English & Indonesian), complex financial infographics, product catalog systems, and executive pitch decks.",
    coverImage: "/placeholder-editorial-hero.svg",
    aspectRatio: "16/9",
    tags: ["Editorial", "Bilingual Grid", "Company Profile", "Data Visualization", "B2B Decks"],
    metrics: [
      { label: "Publication Scope", value: "72-Page Bilingual Profile" },
      { label: "Information Density", value: "35+ Custom Data Visuals" },
      { label: "Grid Rigor", value: "12-Column Compound Modular System" }
    ],
    overview: {
      challenge:
        "Bilingual publications (English and Indonesian) inherently face text-expansion challenges: Indonesian text often requires 20% to 35% more word length than English. Without careful grid design, layouts break, visual weights distort, and executive clarity suffers.",
      strategicSolution:
        "Engineered a 12-column compound grid with asymmetric parallel text columns, baseline-locked typography, and tailored typographic scale contrast. Created a custom data visualization library (charts, process diagrams, financial milestones) that retains sharp legibility whether printed or projected in boardroom pitch decks.",
      outcome:
        "Delivered a timeless, boardroom-ready company profile and modular deck template currently utilized by executive leadership for multi-million-dollar partnerships and international investor pitches."
    },
    deliverables: [
      "72-Page Bilingual Company Profile & Annual Report",
      "Executive Keynote & PowerPoint Master System (16:9)",
      "Bespoke Financial & Operational Data Visualization Suite",
      "Print Specs (Otabind Lay-Flat Binding, GF Smith Colorplan Covers)",
      "Interactive Digital PDF with Bookmarked Navigation & Hyperlinks"
    ],
    specs: {
      "Grid System": "12-Column Modular Grid with 6-Unit Baseline Subdivisions",
      "Type Hierarchy": "Display Serif (Titles) + Monospace (Data & Tables) + Grotesk (Body)",
      "Languages": "English (Primary) and Bahasa Indonesia (Secondary parallel stream)",
      "Binding & Paper": "Otabind Layflat, Fedrigoni Arena Natural Rough 140gsm text, 300gsm cover"
    },
    sections: [
      {
        id: "bilingual-grid",
        title: "The Bilingual Layout & Typographic Balance",
        kicker: "Editorial Architecture",
        description:
          "Balancing English and Indonesian text streams side by side without awkward line breaks or orphan words through careful tracking, column ratios, and baseline alignment.",
        type: "editorial",
        items: [
          {
            caption: "Compound 12-Column Grid with Asymmetric Translation Flow",
            subcaption: "English primary lead column paired with balanced Indonesian parallel notes.",
            aspect: "16/9"
          },
          {
            caption: "Financial Milestone & Operational Timeline Spreads",
            subcaption: "Simplifying dense multi-year audit data into clean executive narratives.",
            aspect: "16/9"
          }
        ]
      },
      {
        id: "catalog-system",
        title: "Catalog Hierarchy & Data Visualization",
        kicker: "Information Clarity",
        description:
          "Designing complex product specifications, dimension tables, and technical certifications with Swiss editorial rigor.",
        type: "gallery",
        items: [
          {
            caption: "Technical Spec Sheet Matrix",
            subcaption: "Rigid tab-stop alignment with clear visual indexing for rapid scanning.",
            aspect: "4/3"
          },
          {
            caption: "Lay-Flat Otabind Physical Print Finishing",
            subcaption: "Unbroken spreads across the spine with blind-embossed linen cover.",
            aspect: "4/3"
          }
        ]
      }
    ]
  }
];

import siteJson from "@/content/site.json";
import projectsJson from "@/content/projects.json";

export const SITE_METADATA: SiteMetadata =
  (siteJson as unknown as SiteMetadata) || DEFAULT_SITE_METADATA;

export const PROJECTS: ProjectItem[] =
  (projectsJson as unknown as ProjectItem[]) || DEFAULT_PROJECTS;
