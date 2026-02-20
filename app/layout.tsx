import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "มาช่วยติวน้องซัมเมอร์สอบกันเถอะ!!",
  description: "แอปติวสอบ ป.1 อัสสัมชัญสมุทรปราการ",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/></head>
      <body style={{ margin:0, padding:0, overflow:"hidden" }}>{children}</body>
    </html>
  );
}
