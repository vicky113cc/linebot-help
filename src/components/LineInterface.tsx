
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDisasterStore } from '@/store/disasterStore';
import { MessageCircle, Users, AlertTriangle, MapPin, Clock, Phone, User } from 'lucide-react';

export const LineInterface = () => {
  const { disasterReports } = useDisasterStore();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const pendingReports = disasterReports.filter(report => report.status === 'pending');

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

  const ChatList = () => (
    <div className="space-y-1">
      {pendingReports.map((report) => (
        <Sheet key={report.id}>
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
                    <h3 className="font-medium text-gray-900 truncate">{report.name}</h3>
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
                救援案件詳情
              </SheetTitle>
            </SheetHeader>
            
            <ScrollArea className="h-full mt-6">
              <div className="space-y-6">
                {/* User Info */}
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

                {/* Contact Info */}
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

                {/* Location */}
                <div className="bg-white border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">位置</span>
                  </div>
                  <p className="font-medium">{report.address}</p>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    查看地圖
                  </Button>
                </div>

                {/* Wait Time */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-700 font-medium">預估等待時間</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700">{report.estimatedWaitTime}</p>
                </div>

                {/* People Count */}
                {report.peopleCount && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-medium">受困人數</span>
                    </div>
                    <p className="text-lg font-bold text-red-700">{report.peopleCount} 人</p>
                  </div>
                )}

                {/* Description */}
                {report.description && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-2">詳細描述</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{report.description}</p>
                  </div>
                )}

                {/* Action Button */}
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg">
                  <Users className="w-5 h-5 mr-2" />
                  我要協助
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );

  return (
    <Card className="max-w-md mx-auto bg-white shadow-lg">
      {/* Header */}
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

      {/* Chat List */}
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {pendingReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>目前沒有救援請求</p>
              <p className="text-sm mt-1">有新的救援案件時會顯示在這裡</p>
            </div>
          ) : (
            <ChatList />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
