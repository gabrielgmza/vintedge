/**
 * Vintedge Database Seed
 * Initial data for development and production
 */

import { PrismaClient, WineType, WineClassification } from '@prisma/client';

const prisma = new PrismaClient();

// Base wines for customization
const winesData = [
  // RED WINES
  {
    sku: 'VTG-RED-001',
    name: 'Vintedge Tempranillo Joven',
    type: WineType.RED,
    region: 'rioja',
    classification: WineClassification.JOVEN,
    grapeVarieties: ['tempranillo'],
    vintage: 2023,
    characteristics: {
      body: 3,
      sweetness: 1,
      acidity: 3,
      tannins: 3,
      alcohol: 13.5,
    },
    tastingNotes: {
      aroma: ['cherry', 'raspberry', 'vanilla'],
      palate: ['fruity', 'smooth', 'balanced'],
      finish: 'Medium with hints of spice',
      pairingsSuggestions: ['grilled meats', 'pasta', 'tapas'],
    },
    ratings: { internal: 88 },
    basePrice: 2500, // $25.00 USD
    imageUrls: ['/wines/tempranillo-joven.jpg'],
    isAvailable: true,
    stockQuantity: 500,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },
  {
    sku: 'VTG-RED-002',
    name: 'Vintedge Crianza Selección',
    type: WineType.RED,
    region: 'ribera-del-duero',
    classification: WineClassification.CRIANZA,
    grapeVarieties: ['tempranillo', 'cabernet-sauvignon'],
    vintage: 2021,
    characteristics: {
      body: 4,
      sweetness: 1,
      acidity: 3,
      tannins: 4,
      alcohol: 14.0,
    },
    tastingNotes: {
      aroma: ['blackberry', 'oak', 'tobacco'],
      palate: ['complex', 'structured', 'elegant'],
      finish: 'Long with notes of dark chocolate',
      pairingsSuggestions: ['lamb', 'aged cheese', 'beef stew'],
    },
    ratings: { internal: 92, parker: 91 },
    basePrice: 4500, // $45.00 USD
    imageUrls: ['/wines/crianza-seleccion.jpg'],
    isAvailable: true,
    stockQuantity: 300,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },
  {
    sku: 'VTG-RED-003',
    name: 'Vintedge Reserva Premium',
    type: WineType.RED,
    region: 'rioja',
    classification: WineClassification.RESERVA,
    grapeVarieties: ['tempranillo', 'garnacha', 'merlot'],
    vintage: 2019,
    characteristics: {
      body: 5,
      sweetness: 1,
      acidity: 3,
      tannins: 4,
      alcohol: 14.5,
    },
    tastingNotes: {
      aroma: ['dried fruit', 'leather', 'cedar'],
      palate: ['rich', 'velvety', 'sophisticated'],
      finish: 'Very long with balsamic notes',
      pairingsSuggestions: ['prime rib', 'game', 'truffle dishes'],
    },
    ratings: { internal: 95, parker: 94, suckling: 93 },
    basePrice: 7500, // $75.00 USD
    imageUrls: ['/wines/reserva-premium.jpg'],
    isAvailable: true,
    stockQuantity: 150,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },
  {
    sku: 'VTG-RED-004',
    name: 'Vintedge Gran Reserva Colección',
    type: WineType.RED,
    region: 'priorat',
    classification: WineClassification.GRAN_RESERVA,
    grapeVarieties: ['garnacha', 'cabernet-sauvignon'],
    vintage: 2017,
    characteristics: {
      body: 5,
      sweetness: 1,
      acidity: 4,
      tannins: 5,
      alcohol: 15.0,
    },
    tastingNotes: {
      aroma: ['blackcurrant', 'mineral', 'graphite'],
      palate: ['powerful', 'intense', 'majestic'],
      finish: 'Extraordinarily long and complex',
      pairingsSuggestions: ['wagyu beef', 'wild boar', 'fine chocolate'],
    },
    ratings: { internal: 98, parker: 97, suckling: 96, penin: 97 },
    basePrice: 15000, // $150.00 USD
    imageUrls: ['/wines/gran-reserva-coleccion.jpg'],
    isAvailable: true,
    stockQuantity: 50,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },

  // WHITE WINES
  {
    sku: 'VTG-WHT-001',
    name: 'Vintedge Albariño Atlántico',
    type: WineType.WHITE,
    region: 'rias-baixas',
    classification: WineClassification.JOVEN,
    grapeVarieties: ['albarino'],
    vintage: 2023,
    characteristics: {
      body: 2,
      sweetness: 1,
      acidity: 4,
      tannins: 1,
      alcohol: 12.5,
    },
    tastingNotes: {
      aroma: ['citrus', 'peach', 'floral'],
      palate: ['crisp', 'refreshing', 'mineral'],
      finish: 'Clean with saline notes',
      pairingsSuggestions: ['seafood', 'sushi', 'salads'],
    },
    ratings: { internal: 90 },
    basePrice: 2800, // $28.00 USD
    imageUrls: ['/wines/albarino-atlantico.jpg'],
    isAvailable: true,
    stockQuantity: 400,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },
  {
    sku: 'VTG-WHT-002',
    name: 'Vintedge Chardonnay Barrica',
    type: WineType.WHITE,
    region: 'napa-valley',
    classification: WineClassification.CRIANZA,
    grapeVarieties: ['chardonnay'],
    vintage: 2022,
    characteristics: {
      body: 4,
      sweetness: 2,
      acidity: 3,
      tannins: 1,
      alcohol: 13.5,
    },
    tastingNotes: {
      aroma: ['butter', 'vanilla', 'tropical fruit'],
      palate: ['creamy', 'rich', 'toasted'],
      finish: 'Long with buttery notes',
      pairingsSuggestions: ['lobster', 'creamy pasta', 'roast chicken'],
    },
    ratings: { internal: 91, parker: 90 },
    basePrice: 4200, // $42.00 USD
    imageUrls: ['/wines/chardonnay-barrica.jpg'],
    isAvailable: true,
    stockQuantity: 250,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },

  // ROSÉ WINES
  {
    sku: 'VTG-RSE-001',
    name: 'Vintedge Rosé Provence',
    type: WineType.ROSE,
    region: 'other',
    classification: WineClassification.JOVEN,
    grapeVarieties: ['garnacha', 'tempranillo'],
    vintage: 2023,
    characteristics: {
      body: 2,
      sweetness: 2,
      acidity: 4,
      tannins: 1,
      alcohol: 12.0,
    },
    tastingNotes: {
      aroma: ['strawberry', 'rose petal', 'citrus'],
      palate: ['fresh', 'elegant', 'fruity'],
      finish: 'Light and refreshing',
      pairingsSuggestions: ['mediterranean cuisine', 'grilled fish', 'summer salads'],
    },
    ratings: { internal: 89 },
    basePrice: 2200, // $22.00 USD
    imageUrls: ['/wines/rose-provence.jpg'],
    isAvailable: true,
    stockQuantity: 350,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: true,
      allowCorkSelection: true,
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },

  // SPARKLING WINES
  {
    sku: 'VTG-SPK-001',
    name: 'Vintedge Brut Reserva',
    type: WineType.SPARKLING,
    region: 'other',
    classification: WineClassification.RESERVA,
    grapeVarieties: ['chardonnay', 'pinot-noir'],
    vintage: 2020,
    characteristics: {
      body: 2,
      sweetness: 1,
      acidity: 4,
      tannins: 1,
      alcohol: 12.0,
    },
    tastingNotes: {
      aroma: ['brioche', 'apple', 'almond'],
      palate: ['elegant', 'fine bubbles', 'complex'],
      finish: 'Persistent with yeasty notes',
      pairingsSuggestions: ['oysters', 'caviar', 'celebrations'],
    },
    ratings: { internal: 93, suckling: 92 },
    basePrice: 5500, // $55.00 USD
    imageUrls: ['/wines/brut-reserva.jpg'],
    isAvailable: true,
    stockQuantity: 200,
    customizationOptions: {
      allowLabelDesign: true,
      allowBottleSelection: false, // Champagne bottles only
      allowCorkSelection: false, // Champagne cork only
      allowCapsuleSelection: true,
      allowPackaging: true,
    },
    restrictedCountries: [],
  },
];

// Label templates
const templatesData = [
  {
    name: 'Classic Elegant',
    category: 'CLASSIC' as const,
    thumbnailUrl: '/templates/classic-elegant-thumb.jpg',
    previewUrl: '/templates/classic-elegant-preview.jpg',
    design: {
      material: 'paper-matte',
      shape: 'rectangle',
      width: 100,
      height: 130,
      backgroundColor: '#ffffff',
      elements: [],
    },
    isPremium: false,
    usageCount: 0,
    isActive: true,
  },
  {
    name: 'Wedding Gold',
    category: 'WEDDING' as const,
    thumbnailUrl: '/templates/wedding-gold-thumb.jpg',
    previewUrl: '/templates/wedding-gold-preview.jpg',
    design: {
      material: 'metallic',
      shape: 'rectangle',
      width: 100,
      height: 130,
      backgroundColor: '#f8f4e8',
      elements: [],
    },
    isPremium: true,
    usageCount: 0,
    isActive: true,
  },
  {
    name: 'Modern Minimalist',
    category: 'MODERN' as const,
    thumbnailUrl: '/templates/modern-minimalist-thumb.jpg',
    previewUrl: '/templates/modern-minimalist-preview.jpg',
    design: {
      material: 'paper-glossy',
      shape: 'rectangle',
      width: 90,
      height: 120,
      backgroundColor: '#000000',
      elements: [],
    },
    isPremium: false,
    usageCount: 0,
    isActive: true,
  },
  {
    name: 'Corporate Professional',
    category: 'CORPORATE' as const,
    thumbnailUrl: '/templates/corporate-pro-thumb.jpg',
    previewUrl: '/templates/corporate-pro-preview.jpg',
    design: {
      material: 'textured',
      shape: 'rectangle',
      width: 100,
      height: 130,
      backgroundColor: '#1a365d',
      elements: [],
    },
    isPremium: true,
    usageCount: 0,
    isActive: true,
  },
  {
    name: 'Birthday Celebration',
    category: 'BIRTHDAY' as const,
    thumbnailUrl: '/templates/birthday-celebration-thumb.jpg',
    previewUrl: '/templates/birthday-celebration-preview.jpg',
    design: {
      material: 'paper-glossy',
      shape: 'oval',
      width: 95,
      height: 125,
      backgroundColor: '#fef3c7',
      elements: [],
    },
    isPremium: false,
    usageCount: 0,
    isActive: true,
  },
  {
    name: 'Anniversary Special',
    category: 'ANNIVERSARY' as const,
    thumbnailUrl: '/templates/anniversary-special-thumb.jpg',
    previewUrl: '/templates/anniversary-special-preview.jpg',
    design: {
      material: 'metallic',
      shape: 'rectangle',
      width: 100,
      height: 130,
      backgroundColor: '#7c3aed',
      elements: [],
    },
    isPremium: true,
    usageCount: 0,
    isActive: true,
  },
];

// Pricing rules
const pricingRulesData = [
  // Bottle pricing
  {
    name: 'Burgundy Bottle Upgrade',
    type: 'BOTTLE' as const,
    conditions: { shape: 'burgundy' },
    modifier: { type: 'fixed', value: 200 },
    priority: 1,
    isActive: true,
  },
  {
    name: 'Magnum Bottle (1.5L)',
    type: 'BOTTLE' as const,
    conditions: { capacity: 1500 },
    modifier: { type: 'fixed', value: 1500 },
    priority: 1,
    isActive: true,
  },
  // Cork pricing
  {
    name: 'Premium Natural Cork',
    type: 'CORK' as const,
    conditions: { type: 'natural-premium' },
    modifier: { type: 'fixed', value: 500 },
    priority: 1,
    isActive: true,
  },
  {
    name: 'Glass Stopper',
    type: 'CORK' as const,
    conditions: { type: 'glass-stopper' },
    modifier: { type: 'fixed', value: 800 },
    priority: 1,
    isActive: true,
  },
  // Volume discounts
  {
    name: '6+ Bottles Discount',
    type: 'VOLUME_DISCOUNT' as const,
    conditions: { minQuantity: 6 },
    modifier: { type: 'percentage', value: 5 },
    priority: 10,
    isActive: true,
  },
  {
    name: '12+ Bottles Discount',
    type: 'VOLUME_DISCOUNT' as const,
    conditions: { minQuantity: 12 },
    modifier: { type: 'percentage', value: 10 },
    priority: 20,
    isActive: true,
  },
  {
    name: '24+ Bottles Discount',
    type: 'VOLUME_DISCOUNT' as const,
    conditions: { minQuantity: 24 },
    modifier: { type: 'percentage', value: 15 },
    priority: 30,
    isActive: true,
  },
];

async function main() {
  console.log('🍷 Seeding Vintedge database...');

  // Clear existing data (development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Clearing existing data...');
    await prisma.orderEvent.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.customization.deleteMany();
    await prisma.wine.deleteMany();
    await prisma.labelTemplate.deleteMany();
    await prisma.pricingRule.deleteMany();
    await prisma.promoCode.deleteMany();
  }

  // Seed wines
  console.log('Seeding wines...');
  for (const wine of winesData) {
    await prisma.wine.create({ data: wine });
  }
  console.log(`✅ Created ${winesData.length} wines`);

  // Seed label templates
  console.log('Seeding label templates...');
  for (const template of templatesData) {
    await prisma.labelTemplate.create({ data: template });
  }
  console.log(`✅ Created ${templatesData.length} label templates`);

  // Seed pricing rules
  console.log('Seeding pricing rules...');
  for (const rule of pricingRulesData) {
    await prisma.pricingRule.create({ data: rule });
  }
  console.log(`✅ Created ${pricingRulesData.length} pricing rules`);

  // Create a welcome promo code
  console.log('Creating welcome promo code...');
  await prisma.promoCode.create({
    data: {
      code: 'WELCOME10',
      description: 'Welcome discount for new customers',
      discountType: 'PERCENTAGE',
      discountValue: 1000, // 10% (in basis points)
      minOrderAmount: 5000, // $50 minimum
      maxDiscount: 2500, // Max $25 discount
      usageLimit: 1000,
      perUserLimit: 1,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true,
    },
  });
  console.log('✅ Created WELCOME10 promo code');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Summary:');
  console.log(`- ${winesData.length} wines`);
  console.log(`- ${templatesData.length} label templates`);
  console.log(`- ${pricingRulesData.length} pricing rules`);
  console.log('- 1 promo code (WELCOME10)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
