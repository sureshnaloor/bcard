export interface Card {
  id: string;
  name: string;
  material: 'metal' | 'white' | 'black' | 'blue' | 'carbon-fiber';
  image: string;
  description: string;
}

export interface CardSet {
  id: string;
  name: string;
  type: 'single' | 'triple' | 'quintuple';
  cards: Card[];
  price: number;
  currency: string;
  description: string;
  image: string; // Main display image
  images: string[]; // All card images in the set
} 