import React, { useEffect } from "react";
import { useDashboardStats } from "../../features/dashboard/hooks/useDashboardStats";
import { DashboardStats } from "../../features/dashboard/ui/DashboardStats";
import { AnalyticsChart } from "../../features/dashboard/ui/AnalyticsChart";
import Card from "../../shared/ui/Card";
import Loader from "../../shared/ui/Loader";
import { MetaTags } from "../../app/seo/MetaTags";

const DashboardPage: React.FC = () => {
  const { loading, error, fetchStats } = useDashboardStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <>
      <MetaTags title="Адмін-панель — Дашборд" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gold-300">
          Адмін-дешборд
        </h1>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {error && (
          <Card className="border-red-500/40 bg-red-500/5 text-red-200 p-4">
            {error}
          </Card>
        )}

        {!loading && !error && (
          <>
            <DashboardStats />
            <AnalyticsChart />
          </>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
