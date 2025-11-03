import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col font-game relative">
       <div className="absolute inset-0 scanlines z-0" />
      <Header />
      <main className="flex-grow z-10">{children}</main>
      <Footer />
    </div>
  );
}
