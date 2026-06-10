import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sipariş Özeti | ALLURE',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SiparisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
