"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [accounts, setAccounts] = useState([]);

  // Function to fetch the token from the API
  const fetchToken = async () => {
    try {
      const response = await fetch("/api/getToken", {
        method: "POST", // Ensure the method is set to POST
      });
      const data = await response.json();
      setToken(data.access_token);
      setExpiresIn(data.expires_in);
    } catch (error) {
      // console.error("Failed to fetch token:", error);
    }
  };

  const fetchAccounts = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/api/getAccounts?token=${token}`); // Pass token as a query parameter
      const data = await response.json();

      if (response.ok && data?.data?.accounts) {
        setAccounts(data.data?.accounts);
      } else {
        console.error("Failed to fetch accounts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    // Fetch the token initially
    fetchToken();

    // If expiresIn is set, create a timer to fetch the token again
    if (expiresIn) {
      const timeout = setTimeout(() => {
        fetchToken();
      }, expiresIn * 1000); // expires_in is in seconds, so multiply by 1000 to convert to milliseconds

      // Cleanup the timeout when the component unmounts or expiresIn changes
      return () => clearTimeout(timeout);
    }
  }, [expiresIn]);

  useEffect(() => {
    fetchAccounts();
  }, [token]);

  console.log(accounts);

  return (
    <main className="flex min-h-screen flex-col justify-start p-10">
      <h1 className="text-2xl">Investec Savings Tracker</h1>
    </main>
  );
}
