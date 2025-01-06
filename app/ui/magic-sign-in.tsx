import { signIn } from "@/auth"
import { Button } from "./button"
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { AtSymbolIcon } from '@heroicons/react/24/outline'
 
export function SignIn() {
    const isPending = false

    return (
        <form
            action={async (formData) => {
                'use server'
                await signIn("resend", formData)
            }}
        >
            <div className="flex flex-col gap-2">
                <div>
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="email"
                        >
                        Email
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                        />
                        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Sign in with Resend <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
            </div>
        </form>
    )
}
