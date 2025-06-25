
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Cloud, 
  Wind, 
  Thermometer, 
  Droplets,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { TyphoonInfo, WeatherStation, WeatherAlert } from '@/services/weatherService';
import { weatherService } from '@/services/weatherService';

interface CollapsibleWeatherPanelProps {
  typhoons: TyphoonInfo[];
  stations: WeatherStation[];
  alerts: WeatherAlert[];
  className?: string;
}

export const CollapsibleWeatherPanel = ({ 
  typhoons, 
  stations, 
  alerts, 
  className = "" 
}: CollapsibleWeatherPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'typhoons' | 'stations' | 'alerts'>('overview');

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'typhoons': return <Eye className="w-4 h-4" />;
      case 'stations': return <Thermometer className="w-4 h-4" />;
      case 'alerts': return <AlertTriangle className="w-4 h-4" />;
      default: return <Cloud className="w-4 h-4" />;
    }
  };

  const getWeatherSummary = () => {
    const maxTemp = Math.max(...stations.map(s => s.temperature));
    const maxWind = Math.max(...stations.map(s => s.windSpeed));
    const maxRain = Math.max(...stations.map(s => s.rainfall));
    
    return { maxTemp, maxWind, maxRain };
  };

  const { maxTemp, maxWind, maxRain } = getWeatherSummary();

  return (
    <div className={`fixed top-4 right-4 z-30 w-96 ${className}`}>
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50/80 transition-colors pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                  <Cloud className="w-5 h-5" />
                  即時天氣資訊
                </CardTitle>
                <div className="flex items-center gap-2">
                  {/* 簡要資訊 */}
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {typhoons.length}颱風
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {stations.length}測站
                    </Badge>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {!isOpen && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {maxTemp}°C
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3" />
                    {maxWind}km/h
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    {maxRain}mm
                  </div>
                </div>
              )}
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              {/* 分類導航 */}
              <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                {[
                  { key: 'overview', label: '概覽' },
                  { key: 'typhoons', label: '颱風' },
                  { key: 'stations', label: '測站' },
                  { key: 'alerts', label: '警報' }
                ].map((section) => (
                  <Button
                    key={section.key}
                    variant={activeSection === section.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection(section.key as any)}
                    className="flex-1 h-8 text-xs"
                  >
                    {getSectionIcon(section.key)}
                    {section.label}
                  </Button>
                ))}
              </div>

              {/* 概覽 */}
              {activeSection === 'overview' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{maxTemp}°C</div>
                      <div className="text-xs text-blue-600">最高溫度</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">{maxWind}</div>
                      <div className="text-xs text-purple-600">最大風速 km/h</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">系統狀態</div>
                    <div className="space-y-1 text-xs">
                      <div>活躍颱風: {typhoons.length} 個</div>
                      <div>觀測站: {stations.length} 個</div>
                      <div>天氣警報: {alerts.length} 個</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 颱風資訊 */}
              {activeSection === 'typhoons' && (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {typhoons.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      目前無颱風警報
                    </div>
                  ) : (
                    typhoons.map((typhoon) => (
                      <div key={typhoon.id} className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-red-700">{typhoon.name}</div>
                          <Badge className={weatherService.getTyphoonLevelColor(typhoon.level)}>
                            {typhoon.level}級
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>風速: {typhoon.maxWind} km/h</div>
                          <div>氣壓: {typhoon.pressure} hPa</div>
                          <div>移動: {typhoon.movement.direction}</div>
                          <div>速度: {typhoon.movement.speed} km/h</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 測站資訊 */}
              {activeSection === 'stations' && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stations.slice(0, 6).map((station) => (
                    <div key={station.id} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="font-medium text-blue-700 mb-2 text-sm">{station.name}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          {station.temperature}°C
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="w-3 h-3" />
                          {station.windSpeed}km/h
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {station.humidity}%
                        </div>
                        <div className="flex items-center gap-1">
                          <Cloud className="w-3 h-3" />
                          {station.rainfall}mm
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 警報資訊 */}
              {activeSection === 'alerts' && (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      目前無天氣警報
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-orange-700 text-sm">{alert.title}</div>
                          <Badge className={weatherService.getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{alert.description}</div>
                        <div className="text-xs text-gray-500">
                          影響: {alert.areas.join(', ')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 更新時間 */}
              <div className="text-xs text-gray-500 text-center mt-4 pt-3 border-t">
                最後更新: {new Date().toLocaleTimeString()}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};
