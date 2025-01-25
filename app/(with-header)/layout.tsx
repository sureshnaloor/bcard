import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 flex flex-col pt-16">
        {children}
      </div>
      <Footer />
    </div>
  );
}