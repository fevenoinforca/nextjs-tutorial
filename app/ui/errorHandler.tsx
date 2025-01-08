'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export function ErrorHandler() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const router = useRouter()
    let errorMessage = ""

    switch (error) {
        case "OAuthAccountNotLinked":
            errorMessage = "Another account probably exists with the same e-mail address. Try to connect with your own e-mail."
            break
        case "Unauthorized-User":
            errorMessage = "You are not authorized to use this service."
            break
        default:
            errorMessage = ""
            break
    }

    useEffect(() => {
       if (errorMessage) {
           toast.error(error + ": " + errorMessage)
           router.push("/")
       }
    }, [error])

    return null
}