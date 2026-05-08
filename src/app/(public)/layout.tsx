import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/FloatingContact";
import { getPublicSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { zaloPhone, hotlinePhone } = await getPublicSettings();

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingContact zaloPhone={zaloPhone} hotlinePhone={hotlinePhone} />
    </>
  );
}
