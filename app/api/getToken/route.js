import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Base64 encode the client_id and client_secret
    const basicAuth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${process.env.API_ENDPOINT}/identity/v2/oauth2/token`,
      {
        method: "POST",
        headers: {
          Acceot: "application/json",
          Authorization: `Basic ${basicAuth}`, // Include the Authorization header for Basic Auth
          "x-api-key": process.env.API_KEY, // Include the x-api-key header
        },
        body: new URLSearchParams({
          grant_type: "client_credentials", // Include grant_type in the body
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch token" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // console.error("Error fetching token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
