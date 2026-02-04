import { ClickSparkle } from "@/components/ui/click-sparkle";
import { CustomCursor } from "@/components/ui/custom-cursor";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <div className="font-pixel" lang={lang}>
      <CustomCursor />
      <ClickSparkle />
      {children}
    </div>
  );
}
