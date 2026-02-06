import React, { createContext, useState, useContext, ReactNode } from "react";

// 1. Definisikan tipe data laporan agar konsisten
export interface Report {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "Pending" | "Responded" | "Resolved";
  typeOfNeed: string;
  voiceUri?: string | null;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReportStatus: (
    id: string,
    status: "Responded" | "Resolved",
    typeOfNeed: string
  ) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

// 2. Buat Provider untuk membungkus aplikasi
export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);

  const addReport = (newReport: Report) => {
    setReports((prevReports) => [newReport, ...prevReports]);
  };

  const updateReportStatus = (
    id: string,
    status: "Responded" | "Resolved",
    typeOfNeed: string
  ) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id
          ? { ...report, status: status, typeOfNeed: typeOfNeed }
          : report
      )
    );
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, updateReportStatus }}>
      {children}
    </ReportContext.Provider>
  );
};

// 3. Hook kustom agar mudah digunakan di halaman lain
export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
