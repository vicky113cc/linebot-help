import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, Bot, User, Clock, Calendar, MapPin, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const COURSE_KNOWLEDGE = `課程資訊 - 25N016 環境研究一：人、環境與自然
課程編號：25N016
學校名稱：國立臺北藝術大學
課程名稱：環境研究一：人、環境與自然
英文名稱：Environment Study One: Human, Environment & Nature
教授姓名：陳俊欽（CHEN, JUN-CHIN）
教授單位：人文學院 通識教育中心
聯絡 Email：lanyu_chen@gmcc.tnua.edu.tw
授課方式：實體課程
課程類別：C 類一般課
授課語言：90% 中文、10% 英文
教材語言：90% 中文、10% 英文
開放對象：高中生、準大學生、研究生皆可修課
修課人數上限：20 人
學分數：2 學分（共 36 節課）
授課期間：114 年 7 月 2 日～8 月 9 日，共 6 週

上課地點與教室安排：
地點：國立臺灣大學 校總區
教室排程：
7/2、7/9、7/23：新生 504
7/16：管理學院一號館 403
7/30、8/6：共同 302

上課時間：
週三（室內課）：7/2, 7/9, 7/16, 7/23, 7/30, 8/6
時間：10:20 ～ 12:10
週六（戶外走讀）：7/5, 7/12, 7/19, 7/26, 8/2, 8/9
時間：08:30 ～ 12:30（首次與第六次延至 14:00）

戶外走讀主題與地點：
07/05 河口生活：淡水市區（捷運淡水站集合）
07/12 人鳥河的競爭：關渡（捷運關渡站集合）
07/19 理想家園：天母磺溪（捷運明德站集合）
07/26 水與綠：外雙溪與芝山岩（捷運芝山站集合）
08/02 山中傳奇：草山溫泉（中山樓管制站集合）
08/09 小確幸或大夢魘：內湖大溝溪（捷運大湖公園站集合）

第五次戶外課詳細筆記（08/02 山中傳奇：草山溫泉）：
地點：草山溫泉區域（陽明山國家公園）
主題：溫泉文化、歷史脈絡與環境變遷

歷史文化背景：
- 草山溫泉開發始於日治時期，是台灣北部重要的溫泉勝地
- 溫泉旅館與休閒產業發展歷程：從日式旅館到現代化溫泉度假村
- 溫泉文化的社會意義：休閒、療養、社交功能的演變
- 戰後草山更名為陽明山，象徵政治與文化的轉變

地質與自然環境：
- 火山地形與溫泉成因：大屯火山群的地質特性
- 溫泉水質類型：硫磺泉的特性與功效
- 植被生態：亞熱帶與溫帶植物的交會區域
- 季節變化：春季櫻花、夏季綠意、秋季芒草、冬季雲霧

人文景觀與藝術：
- 溫泉建築美學：日式建築與現代設計的融合
- 文學作品中的草山：作家筆下的溫泉意象
- 繪畫與攝影：視覺藝術家如何呈現溫泉景致
- 現代藝術裝置：結合自然環境的公共藝術

公共政策與投資：
- 國家公園法規對溫泉開發的限制與保護
- 公共建設投資：道路、停車場、遊客中心建設
- 環境保護與觀光發展的平衡
- 地方政府與中央政府的政策協調

第三次戶外課補充筆記（07/19 理想家園：天母磺溪）：
地點：天母磺溪流域
主題：都市河川復育與社區發展

河川生態復育：
- 磺溪水質改善計畫：從污染河川到生態廊道
- 河岸植被復育：原生植物種植與外來種控制
- 魚類回游：溪流生態系統的重建成果
- 社區參與：居民自發性的河川認養活動

都市規劃與環境設計：
- 河川公園化：將河川整合入都市綠地系統
- 步道系統設計：親水性與安全性的考量
- 雨水管理：透水鋪面與滯洪設施
- 社區空間規劃：河川與住宅區的關係

歷史文化保存：
- 天母地名由來：原住民凱達格蘭族的歷史痕跡
- 日治時期的溫泉文化：天母溫泉的發展歷程
- 戰後社區發展：外籍人士社區的形成與特色
- 文化地景保護：如何在開發中保持地方特色

藝術與創意活動：
- 社區藝術節：結合河川主題的創作活動
- 環境教育：學校與社區的合作模式
- 生態導覽：培養在地解說員的重要性
- 數位記錄：運用新媒體記錄河川變遷

公共投資效益：
- 河川整治經費：政府投資的成本效益分析
- 房地產增值：環境改善對周邊地價的影響
- 觀光效益：生態旅遊帶來的經濟收益
- 社會效益：居民生活品質的提升

課程目標重點：
理解人與自然的互動關係
認識都市水岸發展與環境變遷
培養生態敏感度與生活美學觀念
實地觀察河流上下游、都市發展與人文景觀

成績評分方式：
室內課程參與（6 次，每次 5%）：30%
戶外走讀參與（6 次，每次 5%）：30%
提問尋答作業（6 次，每次 4%）：24%
自主學習計畫與成果：16%（4% + 12%）

作業說明：
走讀提問尋答（個人）：走讀前提問，過程中紀錄，課後分享與繳交
學期自主學習（個人/小組）：提出學習主題與成果，於第六週展示分享

特別提醒：
08/13 為所有作業繳交截止日
遲到早退或作業遲交將扣分
鼓勵課堂發言與提問，將有紅利點數加分
早鳥+1分 發言每次+1 當天上限總分8分
會有簽到簽退`;

export const OnlineChatroom = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是環境研究課程助教機器人 🌿 很高興為您服務！\n\n我可以協助您了解「環境研究一：人、環境與自然」課程的相關資訊，包括：\n• 課程安排與時間\n• 戶外走讀活動\n• 成績評分方式\n• 作業要求\n• 教授聯絡方式\n\n請隨時提出您的問題！',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateRAGResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // 課程基本資訊
    if (message.includes('課程編號') || message.includes('課程名稱') || message.includes('教授')) {
      return '📚 **課程基本資訊**\n\n• **課程編號**：25N016\n• **課程名稱**：環境研究一：人、環境與自然\n• **英文名稱**：Environment Study One: Human, Environment & Nature\n• **授課教授**：陳俊欽（CHEN, JUN-CHIN）\n• **教授單位**：人文學院 通識教育中心\n• **聯絡信箱**：lanyu_chen@gmcc.tnua.edu.tw\n• **學分數**：2學分（共36節課）';
    }
    
    // 上課時間與地點
    if (message.includes('時間') || message.includes('地點') || message.includes('教室') || message.includes('何時') || message.includes('哪裡')) {
      return '🏫 **上課時間與地點**\n\n**授課期間**：114年7月2日～8月9日（共6週）\n**上課地點**：國立臺灣大學校總區\n\n**週三室內課**（10:20-12:10）：\n• 7/2, 7/9, 7/23：新生504\n• 7/16：管理學院一號館403\n• 7/30, 8/6：共同302\n\n**週六戶外走讀**（08:30-12:30）：\n• 首次（7/5）與第六次（8/9）延至14:00';
    }
    
    // 戶外走讀
    if (message.includes('戶外') || message.includes('走讀') || message.includes('實地') || message.includes('淡水') || message.includes('關渡') || message.includes('天母') || message.includes('陽明山') || message.includes('內湖')) {
      return '🚶‍♂️ **戶外走讀活動**\n\n**集合時間**：每週六上午08:30\n\n1. **07/05 河口生活**：淡水市區（捷運淡水站1號出口集合）\n2. **07/12 人鳥河的競爭**：關渡（捷運關渡站1號出口集合）\n3. **07/19 理想家園**：天母磺溪（捷運明德站1號出口集合）\n4. **07/26 水與綠**：外雙溪與芝山岩（捷運芝山站1號出口集合）\n5. **08/02 山中傳奇**：草山溫泉（中山樓管制站集合）\n6. **08/09 小確幸或大夢魘**：內湖大溝溪（捷運大湖公園站2號出口集合）';
    }

    // 草山溫泉相關詳細內容
    if (message.includes('草山') || message.includes('溫泉') || message.includes('陽明山') || message.includes('第五次') || message.includes('山中傳奇')) {
      return '🌋 **第五次戶外課：草山溫泉深度解析**\n\n**歷史文化背景**：\n• 草山溫泉開發始於日治時期，是台灣北部重要溫泉勝地\n• 從日式旅館到現代化溫泉度假村的發展歷程\n• 戰後草山更名為陽明山，象徵政治文化轉變\n\n**地質與自然環境**：\n• 大屯火山群地質特性與硫磺泉成因\n• 亞熱帶與溫帶植物交會的生態特色\n• 四季景觀變化：春櫻、夏綠、秋芒、冬霧\n\n**藝術與人文**：\n• 日式建築與現代設計的美學融合\n• 文學作品中的草山意象\n• 結合自然環境的公共藝術裝置\n\n**公共政策與投資**：\n• 國家公園法規的保護與開發限制\n• 觀光發展與環境保護的平衡策略';
    }

    // 天母磺溪相關詳細內容
    if (message.includes('天母') || message.includes('磺溪') || message.includes('第三次') || message.includes('理想家園') || message.includes('河川復育')) {
      return '🏞️ **第三次戶外課：天母磺溪深度解析**\n\n**河川生態復育**：\n• 從污染河川到生態廊道的復育歷程\n• 原生植物種植與外來種控制策略\n• 魚類回游與溪流生態系統重建\n• 社區居民自發性河川認養活動\n\n**都市規劃與環境設計**：\n• 河川公園化與都市綠地系統整合\n• 親水性步道與安全性考量\n• 透水鋪面與滯洪設施的雨水管理\n\n**歷史文化保存**：\n• 凱達格蘭族歷史痕跡與地名由來\n• 日治時期天母溫泉文化發展\n• 外籍人士社區形成與文化特色\n\n**藝術與創意**：\n• 社區藝術節與河川主題創作\n• 環境教育與在地解說員培養\n• 新媒體記錄河川變遷歷程\n\n**公共投資效益**：\n• 河川整治的成本效益分析\n• 環境改善對房地產增值的影響';
    }
    
    // 成績評分
    if (message.includes('成績') || message.includes('評分') || message.includes('分數') || message.includes('作業') || message.includes('考試')) {
      return '📊 **成績評分方式**\n\n• **室內課程參與**：30%（6次，每次5%）\n• **戶外走讀參與**：30%（6次，每次5%）\n• **提問尋答作業**：24%（6次，每次4%）\n• **自主學習計畫與成果**：16%（4% + 12%）\n\n**加分機制**：\n• 早鳥：+1分\n• 課堂發言：每次+1分（當天上限8分）\n• 會有簽到簽退\n\n**重要日期**：08/13為所有作業繳交截止日';
    }
    
    // 課程目標
    if (message.includes('目標') || message.includes('學習') || message.includes('內容') || message.includes('什麼')) {
      return '🎯 **課程目標重點**\n\n• 理解人與自然的互動關係\n• 認識都市水岸發展與環境變遷\n• 培養生態敏感度與生活美學觀念\n• 實地觀察河流上下游、都市發展與人文景觀\n\n**授課語言**：90%中文、10%英文\n**開放對象**：高中生、準大學生、研究生皆可修課\n**修課人數上限**：20人';
    }
    
    // 作業說明
    if (message.includes('作業') || message.includes('報告') || message.includes('自主學習')) {
      return '📝 **作業說明**\n\n**1. 走讀提問尋答作業（個人）**：\n• 走讀前提問\n• 過程中紀錄\n• 課後分享與繳交\n• 共6次，每次4%\n\n**2. 自主學習計畫（個人/小組）**：\n• 提出學習主題與成果\n• 於第六週展示分享\n• 計畫4% + 成果12%\n\n**重要提醒**：遲到早退或作業遲交將扣分';
    }
    
    // 聯絡方式
    if (message.includes('聯絡') || message.includes('email') || message.includes('信箱') || message.includes('問題')) {
      return '📧 **聯絡方式**\n\n**教授**：陳俊欽（CHEN, JUN-CHIN）\n**Email**：lanyu_chen@gmcc.tnua.edu.tw\n**單位**：人文學院 通識教育中心\n\n如有課程相關問題，歡迎透過Email聯絡教授！';
    }
    
    // 默認回應
    return '🤖 很抱歉，我沒有找到相關的課程資訊。\n\n您可以詢問我關於：\n• 課程時間與地點\n• 戶外走讀活動（包含草山溫泉、天母磺溪詳細內容）\n• 成績評分方式\n• 作業要求\n• 教授聯絡方式\n• 課程目標與內容\n\n請試著重新提問，我會盡力為您解答！';
  };

  const sendToWebhook = async (message: string) => {
    try {
      await fetch('https://linebot-n8n.zeabur.app/webhook/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          source: 'chatroom',
          user_id: 'anonymous_' + Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to send message to webhook:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      toast({
        title: "請輸入訊息",
        description: "請輸入您想詢問的問題",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send message to webhook
    await sendToWebhook(inputMessage);
    
    setInputMessage('');
    setIsTyping(true);

    // 模擬AI思考時間
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateRAGResponse(userMessage.content),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[700px] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">環境研究課程助教聊天室</h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                AI助教為您解答「環境研究一：人、環境與自然」課程相關問題
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
              <BookOpen className="w-3 h-3 mr-1" />
              線上服務
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* 聊天記錄區域 */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* 頭像 */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* 訊息氣泡 */}
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-2 flex items-center gap-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 正在輸入指示器 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 輸入區域 */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-3">
              <Input
                placeholder="請輸入您的問題，例如：課程時間、戶外走讀、成績評分..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* 快捷問題建議 */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage('課程時間和地點')}
                className="text-xs"
              >
                <Calendar className="w-3 h-3 mr-1" />
                課程時間
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage('戶外走讀活動')}
                className="text-xs"
              >
                <MapPin className="w-3 h-3 mr-1" />
                戶外走讀
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage('成績評分方式')}
                className="text-xs"
              >
                📊
                成績評分
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputMessage('教授聯絡方式')}
                className="text-xs"
              >
                📧
                聯絡教授
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};