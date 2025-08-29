import { connectDB } from "@/lib/dbConnect";
import { Users } from "@/models/users.models";

export async function GET() {
  await connectDB();

  const user = await Users.create({
    username: "sarthakk04", // 👈 matches schema
  });

  return new Response(JSON.stringify(user), { status: 201 });
}
