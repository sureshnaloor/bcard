import { CardSet } from '@/types/cards';

export const cardSets: CardSet[] = [
  {
    id: 'single-white',
    name: 'Classic White Card',
    type: 'single',
    price: 29.99,
    currency: 'USD',
    description: 'Single premium white card for minimalist style',
    image: '/images/cards/white-card.jpg',
    images: ['/images/cards/white-card.jpg'],
    cards: [
      {
        id: 'white-1',
        name: 'White Card',
        material: 'white',
        image: '/images/cards/white-card.jpg',
        description: 'Premium white card'
      }
    ]
  },
  {
    id: 'triple-set',
    name: 'Premium Triple Set',
    type: 'triple',
    price: 79.99,
    currency: 'USD',
    description: 'Set of 3 premium cards including metal, white, and carbon fiber',
    image: '/images/cards/triple-set.jpg',
    images: [
      '/images/cards/metal-card.jpg',
      '/images/cards/white-card.jpg',
      '/images/cards/carbon-card.jpg'
    ],
    cards: [
      {
        id: 'metal-1',
        name: 'Metal Card',
        material: 'metal',
        image: '/images/cards/metal-card.jpg',
        description: 'Premium metal card'
      },
      {
        id: 'white-1',
        name: 'White Card',
        material: 'white',
        image: '/images/cards/white-card.jpg',
        description: 'Premium white card'
      },
      {
        id: 'carbon-1',
        name: 'Carbon Fiber Card',
        material: 'carbon-fiber',
        image: '/images/cards/carbon-card.jpg',
        description: 'Premium carbon fiber card'
      }
    ]
  },
  {
    id: 'quintuple-set',
    name: 'Ultimate Collection',
    type: 'quintuple',
    price: 129.99,
    currency: 'USD',
    description: 'Complete set of 5 premium cards in all available materials',
    image: '/images/cards/quintuple-set.jpg',
    images: [
      '/images/cards/metal-card.jpg',
      '/images/cards/white-card.jpg',
      '/images/cards/black-card.jpg',
      '/images/cards/blue-card.jpg',
      '/images/cards/carbon-card.jpg'
    ],
    cards: [
      {
        id: 'metal-1',
        name: 'Metal Card',
        material: 'metal',
        image: '/images/cards/metal-card.jpg',
        description: 'Premium metal card'
      },
      {
        id: 'white-1',
        name: 'White Card',
        material: 'white',
        image: '/images/cards/white-card.jpg',
        description: 'Premium white card'
      },
      {
        id: 'black-1',
        name: 'Black Card',
        material: 'black',
        image: '/images/cards/black-card.jpg',
        description: 'Premium black card'
      },
      {
        id: 'blue-1',
        name: 'Blue Card',
        material: 'blue',
        image: '/images/cards/blue-card.jpg',
        description: 'Premium blue card'
      },
      {
        id: 'carbon-1',
        name: 'Carbon Fiber Card',
        material: 'carbon-fiber',
        image: '/images/cards/carbon-card.jpg',
        description: 'Premium carbon fiber card'
      }
    ]
  }
]; 