# Welcome to your Expo app 👋

mobile_app/
├── app/ # Direktori Utama Routing (Expo Router)
│ ├── (tabs)/ # Grup Navigasi Tab (Beranda, Lapor, dll)
│ │ ├── \_layout.tsx # Konfigurasi Tab Bar
│ │ ├── Beranda.tsx # Halaman Dashboard User
│ │ └── Lapor.tsx # Entry point ke form laporan
│ ├── \_layout.tsx # Root Layout & Provider (ReportProvider di sini)
│ ├── index.tsx # Logika Redirect (Onboarding/Beranda)
│ ├── onboarding.tsx # Layar Pengenalan
│ ├── loginAdmin.tsx # Layar Login Admin
│ ├── adminDashboard.tsx# Dashboard khusus Admin
│ └── emergencyReport.tsx # Form Pengisian Laporan
│
├── assets/ # Gambar, Font, dan Ikon
│ └── images/ # Ilustrasi Onboarding & Logo
│
├── components/ # Komponen UI yang Reusable (Shared)
│ ├── common/ # Button, Input, Badge (UI Dasar)
│ └── reports/ # ReportCard (Bisa dipakai User & Admin)
│
├── context/ # State Management (Global Store)
│ └── ReportContext.tsx # Logic penyimpanan data laporan
│
├── hooks/ # Custom Hooks (Logic yang dipisah dari UI)
│ └── useLocation.ts # Logic untuk ambil GPS
│
├── constants/ # Warna, Ukuran, dan API Keys
│ └── Colors.ts # Definisi warna (Biru: #4A69E2, dll)
│
└── utils/ # Fungsi Helper (Formatting tanggal, dll)
└── formatDate.ts # Mengubah timestamp ke format Indonesia

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
