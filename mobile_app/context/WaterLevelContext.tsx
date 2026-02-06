import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Tipe Data untuk Historis (Keperluan Grafik)
export interface TMAHistory {
  time: string; // Format "HH:00"
  level: number;
}

// 2. Tipe Data untuk Pintu Air
export interface WaterStation {
  id: string;
  name: string;
  currentLevel: number;
  status: "Normal" | "Siaga 3" | "Siaga 2" | "Siaga 1";
  area: "Utara" | "Selatan" | "Timur" | "Barat" | "Pusat";
  history: TMAHistory[]; // Data untuk grafik statistik
}

interface WaterLevelContextType {
  stations: WaterStation[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const WaterLevelContext = createContext<WaterLevelContextType | undefined>(
  undefined
);

export const WaterLevelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stations, setStations] = useState<WaterStation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Simulasi Scraping & Penyimpanan Data
  const fetchTMAData = async () => {
    setLoading(true);
    try {
      // Di sini nantinya kamu akan memanggil API Backend atau Scraper
      // Simulasi Mock Data:
      const mockData: WaterStation[] = [
        {
          id: "1",
          name: "P.A. Marina Ancol",
          currentLevel: 205,
          status: "Siaga 3",
          area: "Utara",
          history: [
            { time: "12:00", level: 180 },
            { time: "13:00", level: 185 },
            { time: "14:00", level: 195 },
            { time: "15:00", level: 205 }, // Data terbaru
          ],
        },
        {
          id: "2",
          name: "Pasar Ikan",
          currentLevel: 170,
          status: "Normal",
          area: "Utara",
          history: [
            { time: "12:00", level: 160 },
            { time: "13:00", level: 165 },
            { time: "14:00", level: 170 },
          ],
        },
      ];

      setStations(mockData);
    } catch (error) {
      console.error("Error fetching TMA:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTMAData();
    // Interval update tiap 1 jam (3600000 ms)
    const interval = setInterval(fetchTMAData, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WaterLevelContext.Provider
      value={{ stations, loading, refreshData: fetchTMAData }}
    >
      {children}
    </WaterLevelContext.Provider>
  );
};

export const useWaterLevel = () => {
  const context = useContext(WaterLevelContext);
  if (!context)
    throw new Error("useWaterLevel must be used within WaterLevelProvider");
  return context;
};
