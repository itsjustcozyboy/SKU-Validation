import { SkuInput } from '../types';

export const categories = [
  'Cream',
  'Serum',
  'Toner Pad',
  'Sunscreen',
  'Cleanser',
  'Mask Pack',
  'Hair/Scalp Care',
  'Makeup',
  'Other',
];

export const targetConsumers = [
  'Gen Z',
  'Millennials',
  'Sensitive skin users',
  'Acne-prone skin users',
  'Anti-aging users',
  'K-beauty enthusiasts',
  'General beauty shoppers',
];

export const ctaTypes = [
  'Join waitlist',
  'Request sample',
  'Reserve product',
  'Notify me when available',
];

export const emptySkuInput: SkuInput = {
  brandName: '',
  productName: '',
  category: 'Cream',
  targetConsumer: 'K-beauty enthusiasts',
  ingredients: '',
  description: '',
  expectedRetailPrice: 29.99,
  productSize: '',
  productImageUrl: '',
  plannedProductionQuantity: 1000,
  messageA: '',
  messageB: '',
  messageC: '',
  ctaType: 'Join waitlist',
};

export const samplePdrnCream: SkuInput = {
  brandName: 'Demo Beauty',
  productName: 'PDRN Recovery Cream',
  category: 'Cream',
  targetConsumer: 'K-beauty enthusiasts',
  ingredients: 'PDRN, niacinamide, centella asiatica, peptide',
  description: 'A Korean skin recovery cream designed for glow, radiance, and barrier care.',
  expectedRetailPrice: 29.99,
  productSize: '50ml',
  productImageUrl: '',
  plannedProductionQuantity: 2000,
  messageA: 'Korean glass skin recovery cream',
  messageB: 'Barrier repair cream for sensitive skin',
  messageC: 'PDRN-powered radiance cream',
  ctaType: 'Join waitlist',
};
