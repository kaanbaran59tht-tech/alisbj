'use client';

import { sendGAEvent } from '@next/third-parties/google';

interface WhatsAppButtonProps {
  whatsappUrl: string;
  className?: string;
  children: React.ReactNode;
}

export const WhatsAppButton = ({ whatsappUrl, className, children }: WhatsAppButtonProps) => {
  const handleClick = () => {
    // Google Analytics Event
    sendGAEvent('event', 'generate_lead', {
      currency: 'TRY',
      value: 1,
    });

    // Facebook Pixel Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: 'WhatsApp Contact' });
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
