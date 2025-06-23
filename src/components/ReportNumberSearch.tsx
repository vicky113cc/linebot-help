
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDisasterStore, DisasterReport } from '@/store/disasterStore';
import { Search, Hash, Clock, MapPin, AlertTriangle, Phone, User, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReportNumberSearch = () => {
  const { disasterReports } = useDisasterStore();
  const { toast } = useToast();
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<DisasterReport | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'status'>('priority');
  const [filteredReports, setFilteredReports] = useState<DisasterReport[]>([]);

  useEffect(() => {
    // 根據排序方式對報告進行排序
    const sorted = [...disasterReports].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.urgency] - priorityOrder[a.urgency];
      } else if (sortBy === 'time') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'status') {
        const statusOrder = { 'pending': 3, 'in-progress': 2, 'completed': 1 };
        return statusOrder[b.status] - statusOrder[a.status];
      }
      return 0;
    });
    setFilteredReports(sorted);
  }, [disasterReports, sortBy]);

  const handleSearch = () => {
    if (!searchNumber.trim()) {
      toast({
        title: "請輸入通報編號",
        description: "請輸入要查詢的通報編號",
        variant: "destructive",
      });
      return;
    }

    const report = disasterReports.find(r => r.id === searchNumber.trim());
    
    if (report) {
      setSearchResult(report);
      toast({
        title: "查詢成功",
        description: `找到通報編號 ${searchNumber} 的案件`,
      });
    } else {
      setSearchResult(null);
      toast({
        title: "查無此編號",
        description: `找不到通報編號 ${searchNumber} 的案件`,
        variant: "destructive",
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待救援';
      case 'in-progress': return '救援中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const getPriorityLevel = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'P0 - 最高優先';
      case 'high': return 'P1 - 高優先';
      case 'medium': return 'P2 - 中優先';
      case 'low': return 'P3 - 低優先';
      default: return 'P? - 未分級';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 搜尋區域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Hash className="w-6 h-6" />
            通報編號查詢系統
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="輸入通報編號 (例如: 1, 2, 3...)"
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="w-4 h-4 mr-2" />
              查詢
            </Button>
          </div>

          {/* 搜尋結果 */}
          {searchResult && (
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-900">
                  通報編號: #{searchResult.id}
                </h3>
                <div className="flex gap-2">
                  <Badge className={getUrgencyColor(searchResult.urgency)}>
                    {getPriorityLevel(searchResult.urgency)}
                  </Badge>
                  <Badge className={getStatusColor(searchResult.status)}>
                    {getStatusText(searchResult.status)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{searchResult.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span>{searchResult.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span>{searchResult.address}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-600" />
                    <span>{searchResult.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>{searchResult.estimatedWaitTime}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    通報時間: {new Date(searchResult.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              
              {searchResult.description && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm text-gray-700">{searchResult.description}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 優先級排序區域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            精準救災 - 優先級管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">排序方式:</span>
            <Select value={sortBy} onValueChange={(value: 'priority' | 'time' | 'status') => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">優先級排序</SelectItem>
                <SelectItem value="time">時間排序</SelectItem>
                <SelectItem value="status">狀態排序</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 優先級統計 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['critical', 'high', 'medium', 'low'].map((urgency) => {
              const count = filteredReports.filter(r => r.urgency === urgency && r.status === 'pending').length;
              return (
                <div key={urgency} className="text-center p-3 border rounded-lg">
                  <div className={`text-lg font-bold ${
                    urgency === 'critical' ? 'text-red-600' :
                    urgency === 'high' ? 'text-orange-600' :
                    urgency === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {count}
                  </div>
                  <div className="text-xs text-gray-600">
                    {getUrgencyText(urgency)}案件
                  </div>
                </div>
              );
            })}
          </div>

          {/* 前5個最優先案件 */}
          <h4 className="font-semibold mb-3 text-red-700">🚨 最優先救援案件 (前5名)</h4>
          <div className="space-y-2">
            {filteredReports
              .filter(r => r.status === 'pending')
              .slice(0, 5)
              .map((report, index) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-red-600' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">#{report.id} - {report.name}</div>
                      <div className="text-sm text-gray-600">{report.type} | {report.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(report.urgency)}>
                      {getPriorityLevel(report.urgency)}
                    </Badge>
                    <span className="text-sm text-gray-500">{report.estimatedWaitTime}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
