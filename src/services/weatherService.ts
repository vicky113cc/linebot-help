
// 台灣氣象署開放資料 API 服務
export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  areas: string[];
  effectiveTime: string;
  expireTime: string;
  category: 'typhoon' | 'heavy_rain' | 'strong_wind' | 'other';
}

export interface TyphoonInfo {
  id: string;
  name: string;
  nameEn: string;
  position: {
    lat: number;
    lng: number;
  };
  maxWind: number;
  radius: number;
  pressure: number;
  movement: {
    direction: string;
    speed: number;
  };
  updateTime: string;
  level: number;
}

export interface WeatherStation {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  rainfall: number;
  updateTime: string;
}

class WeatherService {
  private baseUrl = 'https://opendata.cwa.gov.tw/api';
  
  // 模擬資料 - 在實際應用中會從氣象署 API 獲取
  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    // 模擬即時警報資料
    return [
      {
        id: 'alert_001',
        title: '颱風海上警報',
        description: '第10號颱風「海神」對台灣東部海面構成威脅',
        severity: 'severe',
        areas: ['台東縣', '花蓮縣', '宜蘭縣'],
        effectiveTime: new Date().toISOString(),
        expireTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        category: 'typhoon'
      },
      {
        id: 'alert_002',
        title: '大雨特報',
        description: '受颱風外圍環流影響，山區有局部大雨',
        severity: 'moderate',
        areas: ['新北市', '基隆市'],
        effectiveTime: new Date().toISOString(),
        expireTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        category: 'heavy_rain'
      }
    ];
  }

  async getTyphoonInfo(): Promise<TyphoonInfo[]> {
    // 模擬颱風資料
    return [
      {
        id: 'typhoon_10',
        name: '海神',
        nameEn: 'HAISHEN',
        position: {
          lat: 23.5,
          lng: 122.8
        },
        maxWind: 180,
        radius: 120,
        pressure: 925,
        movement: {
          direction: '西北西',
          speed: 15
        },
        updateTime: new Date().toISOString(),
        level: 4
      }
    ];
  }

  async getWeatherStations(): Promise<WeatherStation[]> {
    // 模擬氣象站資料
    return [
      {
        id: 'station_taipei',
        name: '台北',
        position: { lat: 25.0330, lng: 121.5654 },
        temperature: 28.5,
        humidity: 75,
        pressure: 1013.2,
        windSpeed: 12,
        windDirection: '東北',
        rainfall: 2.5,
        updateTime: new Date().toISOString()
      },
      {
        id: 'station_kaohsiung',
        name: '高雄',
        position: { lat: 22.6273, lng: 120.3014 },
        temperature: 32.1,
        humidity: 82,
        pressure: 1011.8,
        windSpeed: 8,
        windDirection: '西南',
        rainfall: 0,
        updateTime: new Date().toISOString()
      },
      {
        id: 'station_hualien',
        name: '花蓮',
        position: { lat: 23.9769, lng: 121.6039 },
        temperature: 26.8,
        humidity: 88,
        pressure: 1009.5,
        windSpeed: 25,
        windDirection: '東',
        rainfall: 8.2,
        updateTime: new Date().toISOString()
      }
    ];
  }

  getSeverityColor(severity: WeatherAlert['severity']): string {
    switch (severity) {
      case 'extreme': return 'bg-purple-600';
      case 'severe': return 'bg-red-600';
      case 'moderate': return 'bg-orange-500';
      case 'minor': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  }

  getTyphoonLevelColor(level: number): string {
    if (level >= 5) return 'bg-purple-600'; // 超強颱風
    if (level >= 4) return 'bg-red-600';    // 強颱
    if (level >= 3) return 'bg-orange-500'; // 中颱
    if (level >= 2) return 'bg-yellow-500'; // 輕颱
    return 'bg-blue-500';                   // 熱帶低壓
  }
}

export const weatherService = new WeatherService();
