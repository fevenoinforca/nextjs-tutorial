import { fetchUsers } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/user/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create User',
  };
   
export default async function Page() {
    const users = await fetchUsers();

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
  