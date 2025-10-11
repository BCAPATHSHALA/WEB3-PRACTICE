"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuBadge,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Cog, DatabaseBackup, Home, Key, Settings } from "lucide-react";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { MdWallet } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const contentItems = [
  { title: "Home", url: "/wallet", icon: Home },
  { title: "Solana Wallets", url: "/wallet/solana-wallets", icon: SiSolana },
  {
    title: "Ethereum Wallets",
    url: "/wallet/ethereum-wallets",
    icon: FaEthereum,
  },
];

const settingsItems = [
  { title: "General", url: "/wallet/settings/general", icon: Cog },
  { title: "Recovery", url: "/wallet/settings/recovery", icon: DatabaseBackup },
  { title: "Security", url: "/wallet/settings/security", icon: Key },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isIconOnly, setIsIconOnly] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Auto-collapse for small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document
          .querySelector("[data-collapsible]")
          ?.setAttribute("data-collapsible", "icon");
        setIsIconOnly(true);
      } else {
        document
          .querySelector("[data-collapsible]")
          ?.setAttribute("data-collapsible", "expanded");
        setIsIconOnly(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detect sidebar toggle (icon/expanded)
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const rootWithAttr =
      headerEl.closest("[data-collapsible]") ||
      document.querySelector("[data-collapsible]");

    if (!rootWithAttr) return;

    const attrVal = rootWithAttr.getAttribute("data-collapsible");
    setIsIconOnly(attrVal === "icon");

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "data-collapsible") {
          const newVal = (m.target as Element).getAttribute("data-collapsible");
          setIsIconOnly(newVal === "icon");
        }
      }
    });

    mo.observe(rootWithAttr, {
      attributes: true,
      attributeFilter: ["data-collapsible"],
    });
    observerRef.current = mo;

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <Sidebar side="left" variant="floating" collapsible="icon">
      <SidebarHeader ref={headerRef as any} className="group">
        <Link
          href="/"
          aria-label="Web3 Wallet"
          className="flex items-center gap-2"
        >
          <MdWallet className="h-7 w-7" />
          {!isIconOnly && (
            <span className="text-sm font-semibold">Web3 Wallet</span>
          )}
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Wallets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* MAIN MENU ITEMS */}
              {contentItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* SETTINGS COLLAPSIBLE ITEMS */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Settings />
                      <span>Settings</span>
                      <SidebarMenuBadge>3</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsItems.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={item.url}
                                className={`flex items-center gap-2 rounded-md px-2 py-1 transition-all ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <item.icon />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <div className="flex justify-end">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
