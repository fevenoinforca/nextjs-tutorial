import { fetchUsers } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/user/create-form';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Create User',
  };
   
export default async function Page() {
    const session = await auth()
     const userRole = session?.user?.role


     if (userRole === "user") {
        redirect('/dashboard')
     }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Users', href: '/dashboard/users' },
            {
                label: 'Create User',
                href: '/dashboard/users/create',
                active: true,
            },
            ]}
        />
        <Form />
        </main>
    );
}
  