import Image from 'next/image';
import { fetchFilteredUsers } from '@/app/lib/data';
import { DeleteUser, UpdateUser } from './buttons';

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await fetchFilteredUsers(query, currentPage);
  
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.image || '/users/default-avatar.png'}
                              className="rounded-full"
                              alt={`${user.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{user.name}</p>
                          </div>
                        <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.emailVerified.toLocaleDateString() ?? 'Unverified'}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <UpdateUser id={user.id} />
                        <DeleteUser id={user.id} disabled={user.role === 'admin'} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Email Verified
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users.map((user) => (
                    <tr key={user.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.image || '/users/default-avatar.png'}
                            className="rounded-full"
                            alt={`${user.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{user.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.emailVerified.toLocaleDateString() ?? 'Unverified'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex justify-end gap-2">
                          <UpdateUser id={user.id} />
                          <DeleteUser id={user.id} disabled={user.role === 'admin'} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
