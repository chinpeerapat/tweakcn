import { SettingsSidebar } from "./components/settings-sidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 md:px-6 md:py-16 lg:flex-row">
      <SettingsSidebar />
      <section className="mx-auto w-full max-w-3xl flex-1 space-y-6">{children}</section>
    </div>
  );
}
