import { lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import UsersTable from '@/app/ui/user/table';
import { CreateUser } from '@/app/ui/user/buttons';
import { fetchUsersPages } from '@/app/lib/data';
import { Suspense } from 'react';
import { UsersTableSkeleton } from '@/app/ui/skeletons';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page(props: { searchParams?: Promise<{ 
    query?: string,
    page?: string,
 }>;
 }) {
     const searchParams = await props.searchParams;
     const query = searchParams?.query || '';
     const currentPage = Number(searchParams?.page) || 1;
     const totalPages = await fetchUsersPages();
     const session = await auth()
     const userRole = session?.user?.role


     if (userRole === "user") {
        redirect('/dashboard')
     }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users..." />
                <CreateUser />
            </div>
            <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
                <UsersTable query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
}
