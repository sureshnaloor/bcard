import React from 'react';

interface BusinessCard {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

interface BusinessCardProps {
  card: BusinessCard;
}

export default function BusinessCard({ card }: BusinessCardProps) {
  return <><h1>{card.name}</h1>
  <p>{card.title}   </p>
  <p>{card.company}</p>
 
  <p>{card.website}</p>
  
  </>;
}   