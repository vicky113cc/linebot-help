
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Search, Filter, MapPin, Clock, Users } from 'lucide-react';
import { useDisasterStore } from '@/store/disasterStore';

export const RescueRequestsList = () => {
  const { disasterReports } = useDisasterStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '緊急';
      case 'high': return '高度';
      case 'medium': return '中度';
      case 'low': return '低度';
      default: return '未知';
    }
  };

  const filteredReports = disasterReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || report.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const stats = {
    total: disasterReports.length,
    pending: disasterReports.filter(r => r.status === 'pending').length,
    inProgress: disasterReports.filter(r => r.status === 'in-progress').length,
    completed: disasterReports.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">總案件數</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">待救援</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">救援中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">已完成</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5" />
            救援案件清單
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜尋姓名、地址或災情類型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有狀態</SelectItem>
                  <SelectItem value="pending">待救援</SelectItem>
                  <SelectItem value="in-progress">救援中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="緊急程度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有程度</SelectItem>
                  <SelectItem value="critical">緊急</SelectItem>
                  <SelectItem value="high">高度</SelectItem>
                  <SelectItem value="medium">中度</SelectItem>
                  <SelectItem value="low">低度</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            共找到 {filteredReports.length} 筆記錄
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <List className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>沒有符合條件的救援案件</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-gray-300">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusText(report.status)}
                          </Badge>
                          <Badge className={getUrgencyColor(report.urgency)}>
                            {getUrgencyText(report.urgency)}
                          </Badge>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                        <h4 className="font-semibold text-lg">{report.name}</h4>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {report.estimatedWaitTime}
                        </div>
                        <div>{new Date(report.timestamp).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{report.address}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        聯絡電話：{report.phone}
                      </div>
                    </div>

                    {report.peopleCount && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <Users className="w-3 h-3" />
                          {report.peopleCount}人受困
                        </Badge>
                      </div>
                    )}

                    {report.description && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{report.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
