'use client';

import { User } from '@/app/lib/definitions';
import {
  AtSymbolIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { State, updateUser } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function EditInvoiceForm({
  user,
}: {
  user: User;
}) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUploadUrl, setImageUploadUrl] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);
  const initialState = {
    message: '',
    errors: {},
  } as const;
  const updateUserAction = updateUser.bind(null, user.id);
  const [state, formAction] = useActionState(updateUserAction, initialState);
  const roles = ['admin', 'user'];
  
  useEffect(() => {
    setUploadedImage(user.image);
  }, [user.image]);

  useEffect(() => {
    if (shouldReload) {
      window.location.reload();
    }
  }, [shouldReload]);

  useEffect(() => {
    if (uploadedImage && uploadedFile) {
      handleImageUpload(uploadedFile);
    }
  }, [uploadedImage, uploadedFile]);

  // Function to handle file upload
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", user.email);
    
    try {
      const response = await fetch('/api/user-image-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error + ". Page will reload in 3 seconds.", {
          onClose: () => setShouldReload(true),
          autoClose: 3000,
        });
      }

      setImageUploadUrl(data.filePath);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* User Role */}
        {user.role === "admin" && (
          <div className="mb-4">
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Choose user role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={user.role}
                aria-describedby="role-error"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.role &&
                state.errors.role.map((error: string) => (
                  <p className="mb-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        )}

        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Enter a name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                placeholder="Enter user name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mb-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* User Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Enter an email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder="Enter user email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mb-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* User Image */}
        <div className="mb-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Upload an image
          </label>
          {uploadedImage && (
            <Image
              src={uploadedImage || user.image}
              alt="User Image"
              width={100}
              height={100}
              className="mb-4"
            />
          )}
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept=".png, .jpg, .jpeg, .webp, .gif"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="image-error"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setUploadedImage(reader.result as string);
                  setUploadedFile(file);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <input type="hidden" name="image"  value={imageUploadUrl || user.image} />
        </div>

        {/* Generic Error Message */}
        <div id="message-error" aria-live="polite" aria-atomic="true" className="justify-self-end">
          {state.message &&
            <p className="mb-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          }
        </div>
        
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`${user.role === "admin" ? "/dashboard/users" : "/dashboard/"}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">
          Edit User
        </Button>
      </div>
    </form>
  );
}
