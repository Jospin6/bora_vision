import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boravision",
  description: "bora vision",
  keywords: ["Boravision", "authentication", "login", "signup"],
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={"bg-[url('/bg.jpg')] bg-center  bg-no-repeat bg-cover fixed left-0 top-0 z-50 w-full h-screen"}
    >
      <div className="absolute top-0 left-0 w-full h-[50px] bg-[#1a1a1a] z-40">
          {/* <AuthNavbar/> */}
      </div>
      <div className="w-full h-screen flex items-center justify-center bg-black pt-10">
        {children}
      </div>

    </div>
  );
}
