
import { create } from 'zustand';

export interface DisasterReport {
  id: string;
  name: string;
  phone: string;
  address: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  peopleCount: string;
  timestamp: Date;
  status: 'pending' | 'in-progress' | 'completed';
  estimatedWaitTime: string;
}

interface DisasterStore {
  disasterReports: DisasterReport[];
  addDisasterReport: (report: DisasterReport) => void;
  updateReportStatus: (id: string, status: DisasterReport['status']) => void;
  getReportsByStatus: (status: DisasterReport['status']) => DisasterReport[];
  getReportsByUrgency: (urgency: DisasterReport['urgency']) => DisasterReport[];
}

export const useDisasterStore = create<DisasterStore>((set, get) => ({
  disasterReports: [
    // 示範資料
    {
      id: '1',
      name: '王小明',
      phone: '0912345678',
      address: '新北市汐止區大同路123號',
      urgency: 'critical',
      type: '淹水',
      description: '一樓完全淹水，二樓有老人無法下樓',
      peopleCount: '2',
      timestamp: new Date(Date.now() - 10 * 60000), // 10分鐘前
      status: 'pending',
      estimatedWaitTime: '10-15分鐘'
    },
    {
      id: '2',
      name: '李美華',
      phone: '0923456789',
      address: '新北市汐止區中正路456號',
      urgency: 'high',
      type: '停電',
      description: '整個社區停電，有嬰兒需要保溫',
      peopleCount: '1',
      timestamp: new Date(Date.now() - 25 * 60000), // 25分鐘前
      status: 'in-progress',
      estimatedWaitTime: '30-45分鐘'
    },
    {
      id: '3',
      name: '張大偉',
      phone: '0934567890',
      address: '新北市汐止區民生路789號',
      urgency: 'medium',
      type: '土石流',
      description: '後院土石流，需要協助清理通道',
      peopleCount: '',
      timestamp: new Date(Date.now() - 45 * 60000), // 45分鐘前
      status: 'pending',
      estimatedWaitTime: '1-2小時'
    }
  ],
  
  addDisasterReport: (report) => set((state) => ({
    disasterReports: [report, ...state.disasterReports]
  })),
  
  updateReportStatus: (id, status) => set((state) => ({
    disasterReports: state.disasterReports.map(report =>
      report.id === id ? { ...report, status } : report
    )
  })),
  
  getReportsByStatus: (status) => {
    return get().disasterReports.filter(report => report.status === status);
  },
  
  getReportsByUrgency: (urgency) => {
    return get().disasterReports.filter(report => report.urgency === urgency);
  }
}));
