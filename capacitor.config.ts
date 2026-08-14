import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lunex.app',
  appName: 'Lunex',
  webDir: 'dist', // tidak dipakai karena server.url diisi, tapi wajib ada
  server: {
    // Ganti URL ini kapan pun kamu pindah ke domain custom
    url: 'https://ais-pre-jzk3cvosewuwjwjlk6wj6k-30001513702.asia-east1.run.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
