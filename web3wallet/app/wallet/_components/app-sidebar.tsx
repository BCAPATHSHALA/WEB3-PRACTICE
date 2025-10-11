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
import {
  Bitcoin,
  Calendar,
  ChevronUp,
  Cog,
  DatabaseBackup,
  Home,
  Inbox,
  Key,
  Search,
  Settings,
  User2,
} from "lucide-react";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { MdWallet } from "react-icons/md";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

const contentItems = [
  {
    title: "Home",
    url: "/wallet",
    icon: Home,
  },
  {
    title: "Solana Wallets",
    url: "/wallet/solana-wallets",
    icon: SiSolana,
  },
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
  return (
    <Sidebar side="left" variant="floating" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="flex items-center space-x-2">
          <MdWallet className="h-8 w-8" />
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Wallets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

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
                      {settingsItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
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
