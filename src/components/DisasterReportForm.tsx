import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { useDisasterStore, DisasterReport } from '@/store/disasterStore';

export const DisasterReportForm = () => {
  const { toast } = useToast();
  const { addDisasterReport } = useDisasterStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    urgency: '' as DisasterReport['urgency'] | '',
    type: '',
    description: '',
    peopleCount: ''
  });

  const urgencyLevels = [
    { value: 'critical', label: '緊急 - 生命危險', color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'high', label: '高度 - 嚴重傷害', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'medium', label: '中度 - 需要協助', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'low', label: '低度 - 一般求助', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  ];

  const disasterTypes = [
    '淹水',
    '火災',
    '地震損壞',
    '土石流',
    '停電',
    '缺水',
    '醫療緊急',
    '受困',
    '其他'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.urgency || !formData.type) {
      toast({
        title: "請填寫必要資訊",
        description: "姓名、電話、地址、緊急程度和災情類型為必填項目",
        variant: "destructive",
      });
      return;
    }

    const newReport: DisasterReport = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      urgency: formData.urgency as DisasterReport['urgency'],
      type: formData.type,
      description: formData.description,
      peopleCount: formData.peopleCount,
      timestamp: new Date(),
      status: 'pending',
      estimatedWaitTime: calculateWaitTime(formData.urgency as DisasterReport['urgency'])
    };

    addDisasterReport(newReport);
    
    toast({
      title: "通報已送出",
      description: `預估等待時間：${newReport.estimatedWaitTime}`,
    });

    // Reset form
    setFormData({
      name: '',
      phone: '',
      address: '',
      urgency: '',
      type: '',
      description: '',
      peopleCount: ''
    });
  };

  const calculateWaitTime = (urgency: DisasterReport['urgency']) => {
    switch (urgency) {
      case 'critical': return '10-15分鐘';
      case 'high': return '30-45分鐘';
      case 'medium': return '1-2小時';
      case 'low': return '2-4小時';
      default: return '待評估';
    }
  };

  const selectedUrgency = urgencyLevels.find(level => level.value === formData.urgency);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-6 h-6" />
          災情通報
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="請輸入您的姓名"
              />
            </div>
            <div>
              <Label htmlFor="phone">聯絡電話 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="請輸入聯絡電話"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">詳細地址 *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="請輸入詳細地址（包含門牌號碼）"
            />
          </div>

          <div>
            <Label htmlFor="urgency">緊急程度 *</Label>
            <Select value={formData.urgency} onValueChange={(value: DisasterReport['urgency']) => setFormData({...formData, urgency: value})}>
              <SelectTrigger>
                <SelectValue placeholder="選擇緊急程度" />
              </SelectTrigger>
              <SelectContent>
                {urgencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className={`flex items-center gap-2 ${level.color}`}>
                      <div className={`w-3 h-3 rounded-full ${level.bgColor}`}></div>
                      {level.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedUrgency && formData.urgency && (
              <div className={`mt-2 p-3 rounded-lg ${selectedUrgency.bgColor} ${selectedUrgency.color} flex items-center gap-2`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  預估等待時間：{calculateWaitTime(formData.urgency)}
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">災情類型 *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇災情類型" />
                </SelectTrigger>
                <SelectContent>
                  {disasterTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="peopleCount">受困人數</Label>
              <Input
                id="peopleCount"
                value={formData.peopleCount}
                onChange={(e) => setFormData({...formData, peopleCount: e.target.value})}
                placeholder="如有受困人員請填寫人數"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">詳細描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="請詳細描述災情狀況、需要什麼協助..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
            <AlertTriangle className="w-5 h-5 mr-2" />
            立即通報
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
