import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT * FROM drivers
      ORDER BY rating DESC
    `;

    return Response.json({ data: result });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}
