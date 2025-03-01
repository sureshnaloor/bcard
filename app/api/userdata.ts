import dbConnect from '@/lib/mongoose'; // Import from mongoose.ts
import User from '@/models/User'; // Import your User model

export default async function handler(req: Request, res: Response) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find(); // Example query
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return new Response(JSON.stringify({ message: 'Error fetching user data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), {
      status: 405,
      headers: {
        'Allow': 'GET',
        'Content-Type': 'application/json'
      }
    });
  }
}