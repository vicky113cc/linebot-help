
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useDisasterStore } from '@/store/disasterStore';

export const VolunteerHelp = () => {
  const { toast } = useToast();
  const { disasterReports, updateReportStatus } = useDisasterStore();
  const [selectedDistance, setSelectedDistance] = useState('2km');

  const distances = ['500m', '1km', '2km', '5km', '10km'];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '緊急';
      case 'high': return '高度';
      case 'medium': return '中度';
      case 'low': return '低度';
      default: return '未知';
    }
  };

  const handleTakeCase = (reportId: string) => {
    updateReportStatus(reportId, 'in-progress');
    toast({
      title: "已接受救援任務",
      description: "請盡快前往現場協助，注意自身安全",
    });
  };

  const pendingReports = disasterReports
    .filter(report => report.status === 'pending')
    .sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
    });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Volunteer Header */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Users className="w-6 h-6" />
            志願救援者面板
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">搜尋範圍：</span>
            {distances.map((distance) => (
              <Button
                key={distance}
                variant={selectedDistance === distance ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDistance(distance)}
                className="text-xs"
              >
                {distance}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {pendingReports.filter(r => r.urgency === 'critical').length}
              </div>
              <div className="text-sm text-red-700">緊急案件</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {pendingReports.filter(r => r.urgency === 'high').length}
              </div>
              <div className="text-sm text-orange-700">高度案件</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingReports.filter(r => r.urgency === 'medium').length}
              </div>
              <div className="text-sm text-yellow-700">中度案件</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {pendingReports.filter(r => r.urgency === 'low').length}
              </div>
              <div className="text-sm text-blue-700">低度案件</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rescue Requests List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          待救援案件清單 ({pendingReports.length})
        </h3>
        
        {pendingReports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">目前沒有待救援的案件</p>
              <p className="text-sm text-gray-500 mt-2">感謝您的志願服務精神！</p>
            </CardContent>
          </Card>
        ) : (
          pendingReports.map((report) => (
            <Card key={report.id} className="border-l-4 border-l-red-400">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getUrgencyColor(report.urgency)}>
                        {getUrgencyText(report.urgency)}
                      </Badge>
                      <Badge variant="outline">{report.type}</Badge>
                      {report.peopleCount && (
                        <Badge variant="secondary">{report.peopleCount}人受困</Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg">{report.name}</h4>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {report.estimatedWaitTime}
                    </div>
                    <div>{new Date(report.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{report.address}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    聯絡電話：{report.phone}
                  </div>
                </div>

                {report.description && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{report.description}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleTakeCase(report.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    我要協助
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4" />
                    導航
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
