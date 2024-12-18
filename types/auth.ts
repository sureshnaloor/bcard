interface UserLimits {
  _id: string;
  email: string;
  cardLimit: number;
  cardIds: string[];  // Array of short IDs
  createdAt: Date;
  updatedAt: Date;
}

export type { UserLimits }; 