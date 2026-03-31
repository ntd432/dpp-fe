export type CategoryExplanation = {
  title: string;
  whatItIs: string;
  whyImportant: string;
  benefitsForManufacturer: string[];
  benefitsForConsumer: string[];
};

export const categoryExplanations: Record<string, CategoryExplanation> = {
  "dpp-information": {
    title: "Passport Information",
    whatItIs:
      "Passport Information is the identity layer of a Digital Product Passport. It includes the passport ID, issuer, data carrier format, product batch details, and serial-level references that uniquely map data to the correct product instance.",
    whyImportant:
      "Without strong product identity and traceability, all downstream lifecycle data can become unreliable. This category ensures that every compliance record, service event, and sustainability metric is attached to the right product.",
    benefitsForManufacturer: [
      "Improves traceability across production lots and serial units.",
      "Speeds up quality investigations and targeted recalls.",
      "Supports audit readiness through consistent identifiers.",
    ],
    benefitsForConsumer: [
      "Helps verify product authenticity and reduce counterfeit risk.",
      "Makes service, warranty, and product history checks easier.",
      "Builds trust through transparent identity data.",
    ],
  },
  "product-information": {
    title: "Product Information",
    whatItIs:
      "Product Information captures core product details such as names, GTIN, serial references, country of origin, production date, and key technical descriptors.",
    whyImportant:
      "It acts as the baseline reference for logistics, sales, compliance, and after-sales operations. Reliable baseline data reduces process errors and supports interoperability between systems.",
    benefitsForManufacturer: [
      "Creates a single source of truth across internal systems.",
      "Reduces product data inconsistencies in operations and reporting.",
      "Supports smoother market access and partner integration.",
    ],
    benefitsForConsumer: [
      "Provides clear product origin and specification visibility.",
      "Improves confidence in product details before and after purchase.",
      "Enables better comparison and informed buying decisions.",
    ],
  },
  sustainability: {
    title: "Sustainability",
    whatItIs:
      "Sustainability data includes environmental footprint indicators, material and energy information, resource consumption, and declarations tied to sustainability performance.",
    whyImportant:
      "This category enables measurable progress on environmental targets and supports transparent reporting aligned with regulations and customer expectations.",
    benefitsForManufacturer: [
      "Supports ESG reporting and sustainability compliance programs.",
      "Reveals hotspots for resource and emission optimization.",
      "Strengthens brand positioning through measurable sustainability evidence.",
    ],
    benefitsForConsumer: [
      "Makes environmental impact easier to understand.",
      "Supports responsible purchasing choices.",
      "Improves trust through verifiable sustainability disclosures.",
    ],
  },
  "usage-and-maintenance": {
    title: "Usage & Maintenance",
    whatItIs:
      "Usage & Maintenance tracks service events, repairs, replacement actions, and guidance that describe how products have been used and maintained over time.",
    whyImportant:
      "Lifecycle service records improve reliability, support circularity, and help extend product life through timely maintenance and repairability insights.",
    benefitsForManufacturer: [
      "Improves post-sales service quality and lifecycle support.",
      "Provides real-world feedback for product improvement.",
      "Helps reduce warranty costs with better diagnostics and history.",
    ],
    benefitsForConsumer: [
      "Makes repair and maintenance decisions clearer and faster.",
      "Helps preserve product value through service transparency.",
      "Extends usable lifetime with better maintenance guidance.",
    ],
  },
  "end-of-life": {
    title: "End-of-Life and Recovery",
    whatItIs:
      "End-of-Life and Recovery documents how products can be collected, disassembled, reused, refurbished, recycled, or treated safely at their end-of-life stage.",
    whyImportant:
      "It enables responsible waste handling and material recovery while reducing environmental harm. It is critical for circular economy workflows and compliance with recovery obligations.",
    benefitsForManufacturer: [
      "Supports circular business models and material recapture.",
      "Improves compliance with take-back and recovery rules.",
      "Reduces disposal risk by standardizing end-of-life procedures.",
    ],
    benefitsForConsumer: [
      "Clarifies how to return, recycle, or dispose of products responsibly.",
      "Encourages safer handling of components and substances.",
      "Improves participation in reuse and recycling programs.",
    ],
  },
  "supply-chain": {
    title: "Supply Chain Data",
    whatItIs:
      "Supply Chain Data covers partners and activities across the value chain, from upstream material suppliers to downstream logistics, service, and recycling actors.",
    whyImportant:
      "End-to-end visibility strengthens traceability, risk management, and collaboration. It helps organizations respond faster to disruptions and prove due diligence.",
    benefitsForManufacturer: [
      "Improves supplier coordination and traceability.",
      "Supports risk mitigation and faster incident response.",
      "Enables better compliance with due-diligence requirements.",
    ],
    benefitsForConsumer: [
      "Increases transparency about where products come from.",
      "Builds confidence in ethical and responsible sourcing.",
      "Provides clearer accountability across the value chain.",
    ],
  },
  guidelines: {
    title: "Guidelines & Manuals",
    whatItIs:
      "Guidelines & Manuals includes instructions for operation, safety, transport, storage, maintenance, and other best-practice procedures across stakeholders.",
    whyImportant:
      "Clear guidance reduces misuse, accidents, and avoidable product failures. It also improves operational consistency and service quality throughout the lifecycle.",
    benefitsForManufacturer: [
      "Reduces misuse-related support and warranty issues.",
      "Improves consistency in handling and servicing products.",
      "Provides a reliable communication channel for lifecycle instructions.",
    ],
    benefitsForConsumer: [
      "Improves safety and correct product usage.",
      "Makes troubleshooting and maintenance easier.",
      "Helps users get better performance over product lifetime.",
    ],
  },
  compliance: {
    title: "Compliance",
    whatItIs:
      "Compliance data includes applicable regulations, certificates, labels, declarations, and evidence showing that a product meets required legal and market standards.",
    whyImportant:
      "Compliance transparency reduces legal risk and supports market access. It ensures stakeholders can verify obligations are met throughout production and lifecycle operations.",
    benefitsForManufacturer: [
      "Reduces compliance risk with organized evidence and records.",
      "Supports faster audits and regulator interactions.",
      "Improves readiness for changing regulatory requirements.",
    ],
    benefitsForConsumer: [
      "Provides confidence that products meet recognized standards.",
      "Improves transparency for safety and quality claims.",
      "Strengthens trust in product legality and reliability.",
    ],
  },
};
