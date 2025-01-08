import { auth } from "@/auth"
import Image from "next/image"
export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
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
  )
}
