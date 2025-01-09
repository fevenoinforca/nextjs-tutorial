import { fetchUserById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/user/edit-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Edit User',
  };
   
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const [user] = await Promise.all([
        fetchUserById(id),
    ]);
    
    if (!user) {
        notFound();
    }

    return (
        <main>
        <Breadcrumbs
            breadcrumbs={[
            { label: 'Users', href: '/dashboard/users' },
            {
                label: 'Edit User',
                href: `/dashboard/users/${id}/edit`,
                active: true,
            },
            ]}
        />
        <Form user={user} />
        </main>
    );
}
  