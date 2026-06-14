import { neon } from "@neondatabase/serverless";

export async function GET(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("user_email");

    let result;
    if (userEmail) {
      result = await sql`
        SELECT rides.*, 
               json_build_object(
                 'first_name', drivers.first_name,
                 'last_name', drivers.last_name,
                 'car_seats', drivers.car_seats
               ) as driver
        FROM rides
        JOIN drivers ON rides.driver_id = drivers.id
        WHERE rides.user_id = (SELECT clerk_id FROM users WHERE email = ${userEmail})
        ORDER BY rides.created_at DESC
        LIMIT 20
      `;
    } else {
      result = await sql`
        SELECT rides.*, 
               json_build_object(
                 'first_name', drivers.first_name,
                 'last_name', drivers.last_name,
                 'car_seats', drivers.car_seats
               ) as driver
        FROM rides
        JOIN drivers ON rides.driver_id = drivers.id
        ORDER BY rides.created_at DESC
        LIMIT 20
      `;
    }

    return Response.json({ data: result });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return Response.json({ error: "Failed to fetch rides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await req.json();

    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = body;

    const result = await sql`
      INSERT INTO rides (
        origin_address, destination_address,
        origin_latitude, origin_longitude,
        destination_latitude, destination_longitude,
        ride_time, fare_price, payment_status,
        driver_id, user_id
      ) VALUES (
        ${origin_address}, ${destination_address},
        ${origin_latitude}, ${origin_longitude},
        ${destination_latitude}, ${destination_longitude},
        ${ride_time}, ${fare_price}, ${payment_status},
        ${driver_id}, ${user_id}
      )
      RETURNING *
    `;

    return Response.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating ride:", error);
    return Response.json({ error: "Failed to create ride" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { ride_id, payment_status } = await req.json();

    const result = await sql`
      UPDATE rides
      SET payment_status = ${payment_status}
      WHERE ride_id = ${ride_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Ride not found" }, { status: 404 });
    }

    return Response.json({ data: result[0] });
  } catch (error) {
    console.error("Error updating ride:", error);
    return Response.json({ error: "Failed to update ride" }, { status: 500 });
  }
}
