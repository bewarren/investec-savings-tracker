import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("token"); // Retrieve token from query parameter

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 401 }
      );
    }

    const accountsResponse = await fetch(
      `${process.env.API_ENDPOINT}/za/pb/v1/accounts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the Bearer token
        },
      }
    );

    if (!accountsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch accounts" },
        { status: accountsResponse.status }
      );
    }

    const accountsData = await accountsResponse.json();
    return NextResponse.json(accountsData);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
