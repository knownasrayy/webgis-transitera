import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow access from local network devices
  allowedDevOrigins: [
    '192.168.1.16',
    'http://192.168.1.16:3000',
    '192.168.1.17',
    'http://192.168.1.17:3000',
    'localhost:3000',
    'http://localhost:3000'
  ],
  // SEC-G3: Standard Security Response Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
