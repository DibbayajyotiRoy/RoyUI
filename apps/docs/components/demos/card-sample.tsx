import type { CarouselImage, CardStat } from '@roy-ui/ui';

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`;

/* One architect-designed modern home, shot across four frames — exterior at
   dusk, the open-plan living/kitchen, the staircase lounge, a styled corner.
   The copy below describes this home, so the gallery and text read as one
   listing rather than stock filler. */
export const sampleImages: CarouselImage[] = [
  { src: u('1600585154340-be6161a56a0c'), alt: 'Timber-and-glass facade lit from within at dusk' },
  { src: u('1600607687939-ce8a6c25118c'), alt: 'Open-plan living room flowing into the kitchen' },
  { src: u('1600566753086-00f18fb6b3ea'), alt: 'Lounge beneath a floating timber staircase, pool beyond' },
  { src: u('1586023492125-27b2c045efd7'), alt: 'Styled reading corner in afternoon light' },
];

/* A plain frame (no arrowheads) for area, a house for rooms. */
export const AreaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M3.5 9h17M9 3.5v17" strokeWidth="1.2" opacity="0.55" />
  </svg>
);

export const RoomsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
  </svg>
);

export const sampleStats: CardStat[] = [
  { icon: <AreaIcon />, value: '264 m²', label: 'Living' },
  { icon: <RoomsIcon />, value: '4', label: 'Bedrooms' },
];

/* Scalar copy, shared so the preview and the docs Default example stay in sync. */
export const sampleContent = {
  badge: 'Prime Pick',
  price: '$1,450,000',
  priceLabel: 'List price',
  subtitle: 'Architect-designed home · Hawthorn, Melbourne',
  author: 'Dibbayajyoti Roy',
  authorHref: 'https://dibbayajyoti.com',
  meta: '2 days ago',
};
