"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  currentBalance: {
    label: "Current Balance",
  },
} satisfies ChartConfig;

const AccountBalances = ({ accounts }: { accounts: any }) => {
  console.log(accounts);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account balances</CardTitle>
        <CardDescription>All of your account balances</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={accounts}>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="currentBalance">
              <LabelList
                position="top"
                dataKey="referenceName"
                fillOpacity={1}
              />
              {accounts.map((account: any) => (
                <Cell
                  key={account.accountId}
                  fill={
                    account.currentBalance > 0
                      ? "hsl(var(--chart-1))"
                      : "hsl(var(--chart-2))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AccountBalances;
