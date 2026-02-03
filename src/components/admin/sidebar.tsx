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
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-zinc-900 font-bold text-sm">CP</span>
        </div>
        <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">ADMIN CONSOLE</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Crazy Fantasy</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Content</p>
        </div>
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group"
          >
            <item.icon size={18} className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                AD
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100">Admin User</p>
                <p className="text-xs text-zinc-500 truncate">admin@mlbl.co.jp</p>
            </div>
        </div>
        <form action={async () => {
            "use server";
            await logout();
        }}>
          <button type="submit" className="flex items-center gap-2 px-2 py-2 w-full rounded-md text-xs font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
