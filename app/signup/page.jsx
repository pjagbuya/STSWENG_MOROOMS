'use server';

import { Signup } from '@/components/signup-form';
import { SecurityService } from '@/lib/security';
import Image from 'next/image';

export default async function Page() {
  let varsecurityQuestions = [];

  try {
    varsecurityQuestions = await SecurityService.getSecurityQuestions();
  } catch (error) {
    // console.error('Failed to load security questions:', error);
    // Use fallback questions
    varsecurityQuestions = [
      { id: 1, question: "DEFAULT: What is your mother's maiden name?" },
      { id: 2, question: 'N/A' },
    ];
  }
  // console.log('Security Questions:', varsecurityQuestions);
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Image
        src="/images/Login-bg.png"
        alt="DLSU classroom"
        layout="fill"
        className="absolute -z-10 opacity-50"
      />
      <Signup
        defaultValues={{
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          securityAnswer1: '',
          securityAnswer2: '',
        }}
        isEdit={false}
        var2securityQuestions={varsecurityQuestions}
      />
    </div>
  );
}
