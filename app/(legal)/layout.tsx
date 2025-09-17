interface LegalLayoutProps {
  children: React.ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return <div className="container mx-auto max-w-3xl px-4 py-16 md:px-6">{children}</div>;
}
