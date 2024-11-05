'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function reserve(formData) {
  console.log('Date Selected:', formData.selectedDate);
  console.log('Hours Selected:', formData.selectedHours);
}
