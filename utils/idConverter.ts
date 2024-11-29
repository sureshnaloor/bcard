import clientPromise from '@/lib/mongodb';

export const shortenId = (fullId: string): string => {
  return `${fullId.slice(0, 4)}${fullId.slice(-4)}`;
};

export const findFullId = async (shortId: string) => {
  if (shortId.length !== 8) {
    return null;
  }

  const pattern = `^${shortId.slice(0, 4)}.*${shortId.slice(-4)}$`;
  
  const client = await clientPromise;
  const db = client.db("businessCards");
  const collection = db.collection('cards');
  
  const card = await collection.findOne({ 
    $expr: {
      $regexMatch: {
        input: { $toString: "$_id" },
        regex: pattern
      }
    }
  });

  console.log('Found card:', card);
  
  return card?._id.toString();
}; 