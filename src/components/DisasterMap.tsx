
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useDisasterStore } from '@/store/disasterStore';

export const DisasterMap = () => {
  const { disasterReports } = useDisasterStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'in-progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待救援';
      case 'in-progress': return '救援中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="w-6 h-6" />
            災情地圖總覽
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mock Map Area */}
          <div className="bg-gray-100 rounded-lg h-96 relative mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">災情地圖</p>
                <p className="text-sm">顯示所有災情點位置</p>
              </div>
            </div>
            
            {/* Mock disaster points */}
            {disasterReports.slice(0, 5).map((report, index) => (
              <div
                key={report.id}
                className={`absolute w-4 h-4 rounded-full ${getStatusColor(report.status)} border-2 border-white shadow-lg`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                }}
                title={`${report.type} - ${report.address}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">待救援</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm">救援中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">已完成</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              <span className="text-sm">其他</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            最新災情動態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {disasterReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                  <div>
                    <div className="font-medium">{report.address}</div>
                    <div className="text-sm text-gray-600">{report.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{getStatusText(report.status)}</Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
