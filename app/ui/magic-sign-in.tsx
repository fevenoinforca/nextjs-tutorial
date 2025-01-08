import React from 'react';
import { signIn } from "@/auth"
import { Button } from "./button"
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { AtSymbolIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { checkUserByEmail } from '../lib/data';
import { redirect } from 'next/navigation';

export function MagicSignIn() {
    return (
        <div>
            <form
                action={async (formData) => {
                    'use server'

                    const inputEmail = formData.get('email')
                    // First check if the user exists in the database
                    const user = await checkUserByEmail(inputEmail as string)  
                    console.log(user)
                    if (user && user.length > 0 && user[0].email === inputEmail) {
                        await signIn("resend", formData)
                    } else {
                        console.log("User not found")
                        return redirect("/?error=Unauthorized-User")
                    }
                }}
            >
                <div className="flex flex-col gap-2">
                    <div className="w-full">
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
                    <Button className="mt-4 w-full">
                        Sign in with my own email <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>
                </div>
            </form>

            {/* OAuth sigin is not enabled in a controlled access context */}

            {/* <div className="my-8 h-[2px] w-full bg-gray-200"></div>

            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <p className="text-center text-md text-gray-500">OR :</p>
                <Button className="mt-4 w-full">
                    Signin with Google account <Image src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
            </form> */}

        </div>
    )
}
