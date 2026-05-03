import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  output: "standalone",
  // Next.js no permite un comodín '*' por seguridad, 
  // así que agregamos dinámicamente todos los IPs comunes de la red local.
  allowedDevOrigins: (() => {
    const origins = ["localhost", "localhost:3000", "0.0.0.0", "172.16.108.57", "172.16.111.103"];
    // Agregar todas las posibles IPs locales de los rangos 192.168.0.x y 192.168.68.x
    for (let i = 0; i <= 255; i++) {
      origins.push(`192.168.0.${i}`);
      origins.push(`192.168.68.${i}`);
    }
    return origins;
  })(),
};

export default withPWA(nextConfig);

