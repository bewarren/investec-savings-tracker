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
    const accounts = accountsData.data?.accounts || [];

    const accountsWithBalances = await Promise.all(
      accounts.map(async (account) => {
        const balanceResponse = await fetch(
          `${process.env.API_ENDPOINT}/za/pb/v1/accounts/${account.accountId}/balance`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          return {
            ...account,
            currentBalance: balanceData?.data?.currentBalance,
            availableBalance: balanceData?.data?.availableBalance,
          };
        } else {
          return { ...account, currentBalance: 0, availableBalance: 0 };
        }
      })
    );

    // const accountsWithTransactions = await Promise.all(
    //   accountsWithBalances.map(async (account) => {
    //     const transactionsResponse = await fetch(
    //       `${process.env.API_ENDPOINT}/za/pb/v1/accounts/${account.accountId}/transactions`,
    //       {
    //         method: "GET",
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //       }
    //     );

    //     if (transactionsResponse.ok) {
    //       const transactionsData = await transactionsResponse.json();
    //       return {
    //         ...account,
    //         transactions: transactionsData.data.transactions,
    //       };
    //     } else {
    //       return { ...account, transactions: [] };
    //     }
    //   })
    // );

    return NextResponse.json(accountsWithBalances);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
