import "./globals.css";

export const metadata = {
  title: "UE guitar chords",
  description: "Türkçe rock gitar akorları repertuarı",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}