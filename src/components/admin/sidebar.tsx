import Link from "next/link";
import { 
  LayoutDashboard, 
  Newspaper, 
  Music, 
  Video, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut,
  Calendar
} from "lucide-react";
import { logout } from "@/app/auth/actions";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Newspaper, label: "News", href: "/admin/news" },
  { icon: Calendar, label: "Lives", href: "/admin/lives" },
  { icon: Music, label: "Discography", href: "/admin/disco" },
  { icon: Video, label: "Movies", href: "/admin/movies" },
  { icon: ShoppingBag, label: "Goods", href: "/admin/goods" },
  { icon: Users, label: "Members", href: "/admin/members" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-zinc-900 text-white min-h-screen flex flex-col border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold font-pixel tracking-wider">ADMIN CP</h1>
        <p className="text-xs text-zinc-500 mt-1">CMS Ver 1.0</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white"
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <form action={async () => {
            "use server";
            await logout();
        }}>
          <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
