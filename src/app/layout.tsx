import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "Upcycling Lab & Custom Shop | Billeteras de Caucho Reciclado",
  description: "Laboratorio digital de customización de ropa vintage, pintura neón, bordados y accesorios impermeables fabricados en caucho 100% reciclado de cámara de bicicleta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-dark-matte text-zinc-100 flex flex-col justify-between selection:bg-neon-amber selection:text-black relative">
        {children}
        
        {/* Botón flotante de cambio de tema global */}
        <div className="fixed bottom-5 left-5 z-50 shadow-2xl">
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
