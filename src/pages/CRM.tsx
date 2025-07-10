import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CRMDashboard } from "@/components/crm/CRMDashboard";
import { CRMLeads } from "@/components/crm/CRMLeads";

export default function CRM() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">CRM - Gestão de Leads</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">Gestão de Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <CRMLeads />
        </TabsContent>
      </Tabs>
    </div>
  );
}
