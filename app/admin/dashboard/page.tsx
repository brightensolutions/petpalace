"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Package, Users, CreditCard } from "lucide-react";

export default function DashboardOverviewPage() {
  const cardClass =
    "p-4 transition-shadow duration-300 hover:shadow-md rounded-xl border bg-white";

  const titleClass = "text-base font-semibold text-orange-600"; // One step larger
  const valueClass = "text-2xl font-bold text-gray-900";

  return (
    <div className="py-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className={titleClass}>Total Revenue</CardTitle>
            <div className="bg-orange-100 p-1.5 rounded-md">
              <DollarSign className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={valueClass}>$45,231.89</div>
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className={titleClass}>Subscriptions</CardTitle>
            <div className="bg-blue-100 p-1.5 rounded-md">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={valueClass}>+2,350</div>
          </CardContent>
        </Card>

        {/* Sales */}
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className={titleClass}>Sales</CardTitle>
            <div className="bg-orange-100 p-1.5 rounded-md">
              <CreditCard className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={valueClass}>+12,234</div>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className={titleClass}>Active Products</CardTitle>
            <div className="bg-blue-100 p-1.5 rounded-md">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={valueClass}>+573</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
