


  // @ts-check
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    async headers() {
        return [
          {
            source: "/api/:path*",
            headers: [
              {
                key: "Access-Control-Allow-Origin",
                value: "*", // Set your origin
              },
              {
                key: "Access-Control-Allow-Methods",
                value: "GET, POST, PUT, DELETE, OPTIONS",
              },
              {
                key: "Access-Control-Allow-Headers",
                value: "Content-Type, Authorization",
              },
              {
                key: "Access-Control-Max-Age",
                value: "86400", // Cache preflight response for 24 hours
              },
            ],
          },
        ];
      },
  }
   
  module.exports = nextConfig