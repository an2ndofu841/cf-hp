import { Construction } from "lucide-react";

export default function AdminMembersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Members Management</h1>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <Construction size={32} />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">Under Construction</h3>
        <p className="text-zinc-500 max-w-sm mx-auto">
            This feature is currently being built. Please check back later.
        </p>
      </div>
    </div>
  );
}
