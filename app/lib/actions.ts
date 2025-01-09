'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' }),
    date: z.string(),
  });

const UserFormSchema = z.object({
    id: z.string(),
    name: z.string({ invalid_type_error: 'Please enter a name.' }).min(1, { message: 'Please enter a name.' }),
    email: z.string({ invalid_type_error: 'Please enter an email.' }).email('Invalid email address.'),
    role: z.string({ invalid_type_error: 'Please select a role.' }),
    image: z.string().optional(),
  });
   
const ValidateCreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const ValidateCreateUser = UserFormSchema.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    role?: string[];
    name?: string[];
    email?: string[];
    image?: string[];
  };
  message: string;
  error?: string;
} | {
  error: string;
  errors?: undefined;
  message?: undefined;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = ValidateCreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Check your inputs and try again.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    try {
        await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

    } catch (error) {
        return {
            error: 'Database Error: Failed to Create Invoice.' + error
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = ValidateCreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Check your inputs and try again.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
      await sql`UPDATE invoices SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status} WHERE id = ${id}`;
    } catch (error) {
        return {
            error: 'Database Error: Failed to Update Invoice.' + error
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function createUser(prevState: State, formData: FormData) {
    const validatedFields = ValidateCreateUser.safeParse({
        role: formData.get('role'),
        name: formData.get('name'),
        email: formData.get('email'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Check your inputs and try again.',
        };
    }

    const { name, email, role, image } = validatedFields.data;

    try {
        await sql`INSERT INTO users (name, email, role, image) VALUES (${name}, ${email}, ${role}, ${image})`;
    } catch (error) {
        return {
            error: 'Database Error: Failed to Create User.' + error
        }
    }

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');
}

export async function updateUser(id: string, prevState: State, formData: FormData) {
    const validatedFields = ValidateCreateUser.safeParse({
        role: formData.get('role') || "user",
        name: formData.get('name'),
        email: formData.get('email'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Check your inputs and try again.',
        };
    }

    const { role, name, email, image } = validatedFields.data;

    try {
        await sql`UPDATE users SET role = ${role}, name = ${name}, email = ${email}, image = ${image} WHERE id = ${id}`;
    } catch (error) {
        return {
            error: 'Database Error: Failed to Update User.' + error
        }
    }

    revalidatePath('/dashboard/users');
    if (role === "admin") {
        redirect('/dashboard/users');
    } else {
        redirect('/dashboard');
    }
}

export async function deleteInvoice(id: string) {
    if (!id) {
        throw new Error('Invoice ID is required.');
    }

    try {   
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return {
            message: 'Invoice deleted successfully.'
        }
    } catch (error) {
        return {
            error: 'Database Error: Failed to Delete Invoice.' + error
        }
    }
}

export async function deleteCustomer(id: string) {
    if (!id) {
        throw new Error('Customer ID is required.');
    }

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
        return {
            message: 'Customer deleted successfully.'
        }
    } catch (error) {
        return {
            error: 'Database Error: Failed to Delete Customer.' + error
        }
    }
}

export async function deleteUser(id: string) {
    if (!id) {
        throw new Error('User ID is required.');
    }

    try {
        await sql`DELETE FROM users WHERE id = ${id}`;
        revalidatePath('/dashboard/users');
        return {
            message: 'User deleted successfully.'
        }
    } catch (error) {
        return {
            error: 'Database Error: Failed to Delete User.' + error
        }
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                return 'Invalid credentials.';
                default:
                return 'Something went wrong.';
            }
        }
        throw error;
    }
}
