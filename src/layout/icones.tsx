// Ícones de traço simples, herdam a cor do texto. Decorativos: o texto ao lado dá o nome.
import type { ReactNode } from 'react';

function Icone({ children }: { children: ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const IconeInicio = () => (
  <Icone>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </Icone>
);

export const IconeColmeias = () => (
  <Icone>
    <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
    <path d="M12 8l3.5 2v4L12 16l-3.5-2v-4L12 8z" />
  </Icone>
);

export const IconeAlertas = () => (
  <Icone>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </Icone>
);

export const IconeOffline = () => (
  <Icone>
    <path d="M12 3v10" />
    <path d="M8 9l4 4 4-4" />
    <path d="M4 17v3h16v-3" />
  </Icone>
);

export const IconeQr = () => (
  <Icone>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M20 20v.01M17 17v3" />
  </Icone>
);
