import { auth } from "@/auth"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
  const isAdmin = session?.user?.role === "admin"
 
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <Image
          src={session?.user?.image || "/users/default-avatar.webp"}
          alt="User Avatar"
          width={28}
          height={28}
          className="rounded-full"
        />
        <p className="text-sm font-medium">{session.user.name}</p>
      </div>
      {isAdmin && (
        <Link href="/dashboard/users">
          <Cog6ToothIcon className="w-6" />
        </Link>
      )}
    </div>
  )
}
