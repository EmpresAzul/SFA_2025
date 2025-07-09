import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CRMBoard } from '@/components/crm/CRMBoard';
import { CRMLeads } from '@/components/crm/CRMLeads';

export default function CRM() {
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">CRM</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <CRMBoard />
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <CRMLeads />
        </TabsContent>
      </Tabs>
    </div>
  );
} 