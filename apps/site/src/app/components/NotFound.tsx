import React from 'react';
import { Button, MascotMessage } from '@bek/react';

/** Noma'lum hash-manzil — Figma 2.3 Mascot "Error / 404 → dizzy". */
export function NotFound({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <MascotMessage
          pose="dizzy"
          size="xl"
          title="Sahifa topilmadi"
          description={`Manzil eskirgan yoki noto'g'ri: ${window.location.hash || '#/'}`}
          action={{ label: 'Komponentlar', onClick: () => onNavigate('components') }}
        />
        <div className="mt-4 text-center">
          <Button variant="flat" onClick={() => onNavigate('home')}>
            Bosh sahifa
          </Button>
        </div>
      </div>
    </div>
  );
}
