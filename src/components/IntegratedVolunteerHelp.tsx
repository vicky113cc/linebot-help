
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDisasterStore, DisasterReport } from '@/store/disasterStore';
import { Search, Hash, Clock, MapPin, AlertTriangle, Phone, User, MessageCircle, Users, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const IntegratedVolunteerHelp = () => {
  const { disasterReports } = useDisasterStore();
  const { toast } = useToast();
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<DisasterReport | null>(null);

  const pendingReports = disasterReports.filter(report => report.status === 'pending');

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
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '？';
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

  const handleLineConnect = () => {
    // 連結到Line應用程式
    const lineUrl = "https://line.me/R/ti/p/@your-line-bot"; // 請替換為您的Line Bot ID
    window.open(lineUrl, '_blank');
    
    toast({
      title: "連結Line應用程式",
      description: "正在開啟Line應用程式連結",
    });
  };

  const ChatListItem = ({ report }: { report: DisasterReport }) => (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-orange-100 text-orange-600">
                <AlertTriangle className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -top-1 -right-1 w-5 h-5 ${getUrgencyColor(report.urgency)} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{getUrgencyText(report.urgency)}</span>
            </div>
          </div>
          
          <div className="flex-1 ml-3 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">#{report.id} - {report.name}</h3>
                <p className="text-sm text-gray-500 truncate">{report.type}</p>
              </div>
              <div className="text-right ml-2">
                <p className="text-xs text-gray-400">{new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <Badge className="bg-red-500 text-white text-xs px-1 py-0 mt-1">新</Badge>
              </div>
            </div>
            
            <div className="flex items-center mt-1">
              <MapPin className="w-3 h-3 text-gray-400 mr-1" />
              <p className="text-xs text-gray-400 truncate">{report.address}</p>
            </div>
          </div>
        </div>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            救援案件詳情 - #{report.id}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full mt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{report.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getUrgencyColor(report.urgency)} text-white`}>
                    {getUrgencyText(report.urgency)}度緊急
                  </Badge>
                  <Badge variant="outline">{report.type}</Badge>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">聯絡電話</span>
              </div>
              <p className="font-medium">{report.phone}</p>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Phone className="w-4 h-4 mr-2" />
                撥打電話
              </Button>
            </div>

            <div className="bg-white border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">位置</span>
              </div>
              <p className="font-medium">{report.address}</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">預估等待時間</span>
              </div>
              <p className="text-lg font-bold text-orange-700">{report.estimatedWaitTime}</p>
            </div>

            {report.description && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-2">詳細描述</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
              </div>
            )}

            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg">
              <Users className="w-5 h-5 mr-2" />
              我要協助
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Users className="w-6 h-6" />
            我要幫忙 - 救援協助中心
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">編號查詢</TabsTrigger>
              <TabsTrigger value="line">Line介面</TabsTrigger>
              <TabsTrigger value="connect">連結Line</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
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

              {searchResult && (
                <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-blue-900">
                      通報編號: #{searchResult.id}
                    </h3>
                    <Badge className={`${getUrgencyColor(searchResult.urgency)} text-white`}>
                      {getUrgencyText(searchResult.urgency)}度緊急
                    </Badge>
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
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Users className="w-4 h-4 mr-2" />
                    我要協助這個案件
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="line">
              <Card className="max-w-md mx-auto bg-white shadow-lg">
                <div className="bg-green-500 text-white p-4 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">救援通訊</h1>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <Badge variant="secondary" className="bg-white text-green-500">
                        {pendingReports.length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-0">
                  <ScrollArea className="h-96">
                    {pendingReports.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>目前沒有救援請求</p>
                        <p className="text-sm mt-1">有新的救援案件時會顯示在這裡</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {pendingReports.map((report) => (
                          <ChatListItem key={report.id} report={report} />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connect">
              <div className="text-center space-y-6">
                <div className="p-8 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-xl font-semibold mb-2">連結Line應用程式</h3>
                  <p className="text-gray-600 mb-4">
                    點擊下方按鈕連結到我們的Line官方帳號，<br />
                    可以直接透過Line接收救援通知和進行通報
                  </p>
                  <Button 
                    onClick={handleLineConnect}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    連結Line官方帳號
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-white border rounded-lg">
                    <h4 className="font-semibold mb-2">✅ Line功能特色</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 即時接收救援通知</li>
                      <li>• 快速通報災情</li>
                      <li>• 查詢案件進度</li>
                      <li>• 志工媒合通知</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white border rounded-lg">
                    <h4 className="font-semibold mb-2">📱 使用說明</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 點擊連結按鈕</li>
                      <li>• 加入Line官方帳號</li>
                      <li>• 開始使用Line救援服務</li>
                      <li>• 設定通知偏好</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
