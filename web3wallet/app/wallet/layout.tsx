import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { cookies } from "next/headers";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

const socialHandles = [
  { link: "https://x.com/manojofficialmj", icon: Twitter },
  {
    link: "https://www.linkedin.com/in/manojofficialmj",
    icon: Linkedin,
  },
  {
    link: "https://github.com/BCAPATHSHALA/WEB3-PRACTICE/tree/web3wallet/web3wallet",
    icon: Github,
  },
];

export default async function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background border-b sticky top-0 z-20">
          <div className="flex justify-between md:justify-end items-center gap-3 p-3">
            <SidebarTrigger className="block md:hidden" />
            <div className="flex gap-3">
              {socialHandles.map((item, i) => {
                return (
                  <Link
                    key={i}
                    href={item.link}
                    target="_blank"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110"
                  >
                    <item.icon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                  </Link>
                );
              })}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
