
import { useState } from 'react';
import { DisasterReportForm } from '@/components/DisasterReportForm';
import { VolunteerHelp } from '@/components/VolunteerHelp';
import { DisasterMap } from '@/components/DisasterMap';
import { RescueRequestsList } from '@/components/RescueRequestsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Users, MapPin, List } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("report");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">災難救援系統</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            鄰里互助・即時救援・優先級管理
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="border-red-200 hover:border-red-400 transition-colors cursor-pointer" 
                onClick={() => setActiveTab("report")}>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">我要通報</h3>
              <p className="text-gray-600">需要幫助或發現災情</p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 hover:border-orange-400 transition-colors cursor-pointer"
                onClick={() => setActiveTab("volunteer")}>
            <CardContent className="p-6 text-center">
              <Users className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">我要幫忙</h3>
              <p className="text-gray-600">提供協助給需要的鄰居</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="report" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              通報
            </TabsTrigger>
            <TabsTrigger value="volunteer" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              救援
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              地圖
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              清單
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <DisasterReportForm />
          </TabsContent>

          <TabsContent value="volunteer">
            <VolunteerHelp />
          </TabsContent>

          <TabsContent value="map">
            <DisasterMap />
          </TabsContent>

          <TabsContent value="list">
            <RescueRequestsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
