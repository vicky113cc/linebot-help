
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  Eye,
  Sun,
  CloudSnow,
  CloudLightning,
  Gauge
} from 'lucide-react';
import { TyphoonInfo, WeatherStation } from '@/services/weatherService';
import { weatherService } from '@/services/weatherService';

interface WeatherMapLayerProps {
  typhoons: TyphoonInfo[];
  stations: WeatherStation[];
  mapWidth: number;
  mapHeight: number;
  showWeather: boolean;
}

export const WeatherMapLayer = ({ 
  typhoons, 
  stations, 
  mapWidth, 
  mapHeight, 
  showWeather 
}: WeatherMapLayerProps) => {
  const [selectedTyphoon, setSelectedTyphoon] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // 台灣地圖邊界 (大約座標範圍)
  const taiwanBounds = {
    north: 25.3,
    south: 21.9,
    east: 122.0,
    west: 119.5
  };

  // 座標轉換函數 - 將經緯度轉換為地圖像素位置
  const coordToPixel = (lat: number, lng: number) => {
    const x = ((lng - taiwanBounds.west) / (taiwanBounds.east - taiwanBounds.west)) * mapWidth;
    const y = ((taiwanBounds.north - lat) / (taiwanBounds.north - taiwanBounds.south)) * mapHeight;
    return { x: Math.max(0, Math.min(mapWidth, x)), y: Math.max(0, Math.min(mapHeight, y)) };
  };

  // 根據天氣條件選擇圖示
  const getWeatherIcon = (station: WeatherStation) => {
    const { temperature, rainfall, windSpeed, humidity } = station;
    
    if (rainfall > 10) return <CloudRain className="w-4 h-4 text-blue-600" />;
    if (rainfall > 2) return <CloudLightning className="w-4 h-4 text-gray-600" />;
    if (windSpeed > 25) return <Wind className="w-4 h-4 text-purple-600" />;
    if (temperature > 32) return <Sun className="w-4 h-4 text-orange-500" />;
    if (temperature < 15) return <CloudSnow className="w-4 h-4 text-blue-400" />;
    if (humidity > 85) return <Cloud className="w-4 h-4 text-gray-500" />;
    return <Sun className="w-4 h-4 text-yellow-500" />;
  };

  // 根據天氣狀況決定警示程度
  const getStationAlertLevel = (station: WeatherStation) => {
    const { rainfall, windSpeed, temperature } = station;
    
    if (rainfall > 15 || windSpeed > 30) return 'severe';
    if (rainfall > 5 || windSpeed > 20 || temperature > 35) return 'moderate';
    if (rainfall > 2 || windSpeed > 15) return 'minor';
    return 'normal';
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'severe': return 'border-red-500 bg-red-100';
      case 'moderate': return 'border-orange-500 bg-orange-100';
      case 'minor': return 'border-yellow-500 bg-yellow-100';
      default: return 'border-green-500 bg-green-100';
    }
  };

  if (!showWeather) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 颱風顯示 */}
      {typhoons.map((typhoon) => {
        const position = coordToPixel(typhoon.position.lat, typhoon.position.lng);
        const isSelected = selectedTyphoon === typhoon.id;
        
        return (
          <div key={typhoon.id} className="absolute">
            {/* 颱風中心 */}
            <div
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
              onClick={() => setSelectedTyphoon(isSelected ? null : typhoon.id)}
            >
              <div className="relative">
                {/* 颱風影響範圍圈 */}
                <div 
                  className={`absolute rounded-full border-2 border-red-500 opacity-30 animate-pulse ${weatherService.getTyphoonLevelColor(typhoon.level)}`}
                  style={{
                    width: `${typhoon.radius * 0.8}px`,
                    height: `${typhoon.radius * 0.8}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                
                {/* 颱風眼 */}
                <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                
                {/* 颱風等級標示 */}
                <div className="absolute -top-2 -right-2">
                  <Badge className={`text-xs ${weatherService.getTyphoonLevelColor(typhoon.level)}`}>
                    {typhoon.level}
                  </Badge>
                </div>
              </div>
              
              {/* 颱風詳細資訊卡片 */}
              {isSelected && (
                <div className="absolute left-full ml-2 top-0 z-50 pointer-events-auto">
                  <Card className="w-64 bg-white shadow-lg border-red-200">
                    <CardContent className="p-3">
                      <div className="font-semibold text-red-700 mb-2">
                        颱風 {typhoon.name} ({typhoon.nameEn})
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>位置: {typhoon.position.lat.toFixed(2)}°N</div>
                        <div>{typhoon.position.lng.toFixed(2)}°E</div>
                        <div>最大風速: {typhoon.maxWind} km/h</div>
                        <div>中心氣壓: {typhoon.pressure} hPa</div>
                        <div>影響半徑: {typhoon.radius} km</div>
                        <div>移動: {typhoon.movement.direction}</div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        更新時間: {new Date(typhoon.updateTime).toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 氣象站顯示 */}
      {stations.map((station) => {
        const position = coordToPixel(station.position.lat, station.position.lng);
        const isSelected = selectedStation === station.id;
        const alertLevel = getStationAlertLevel(station);
        
        return (
          <div key={station.id} className="absolute">
            <div
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
              onClick={() => setSelectedStation(isSelected ? null : station.id)}
            >
              <div className="relative">
                {/* 氣象站圖示 */}
                <div className={`w-6 h-6 rounded-full border-2 ${getAlertColor(alertLevel)} flex items-center justify-center shadow-lg`}>
                  {getWeatherIcon(station)}
                </div>
                
                {/* 警示指示器 */}
                {alertLevel !== 'normal' && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                    alertLevel === 'severe' ? 'bg-red-500' : 
                    alertLevel === 'moderate' ? 'bg-orange-500' : 'bg-yellow-500'
                  }`} />
                )}
              </div>
              
              {/* 氣象站詳細資訊卡片 */}
              {isSelected && (
                <div className="absolute left-full ml-2 top-0 z-50 pointer-events-auto">
                  <Card className="w-56 bg-white shadow-lg border-blue-200">
                    <CardContent className="p-3">
                      <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        {station.name} 測站
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            <span className="text-xs">溫度</span>
                          </div>
                          <span className="text-sm font-medium">{station.temperature}°C</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            <span className="text-xs">濕度</span>
                          </div>
                          <span className="text-sm font-medium">{station.humidity}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Wind className="w-3 h-3" />
                            <span className="text-xs">風速</span>
                          </div>
                          <span className="text-sm font-medium">{station.windSpeed} km/h</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <CloudRain className="w-3 h-3" />
                            <span className="text-xs">雨量</span>
                          </div>
                          <span className="text-sm font-medium">{station.rainfall} mm</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs">氣壓</span>
                          <span className="text-sm font-medium">{station.pressure} hPa</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs">風向</span>
                          <span className="text-sm font-medium">{station.windDirection}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                        位置: {station.position.lat.toFixed(3)}°N, {station.position.lng.toFixed(3)}°E
                      </div>
                      <div className="text-xs text-gray-500">
                        更新: {new Date(station.updateTime).toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 圖例說明 */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-sm font-semibold mb-2">天氣圖例</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>嚴重警戒</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>中度警戒</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>輕度警戒</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>正常狀態</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
