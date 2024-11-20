'use client';

import { mails } from './mail-sample';
import { MailDisplay } from '@/components/mail-display';
import { MailList } from '@/components/mail-list';
import { useState } from 'react';

export default function UserInbox() {
  const [mail, setMail] = useState({
    selected: mails[0].id,
  });

  const currentMail = mails.find(x => x.id == mail.selected);

  return (
    <div className="flex h-[95vh] p-4">
      <MailList items={mails} mail={mail} setMail={setMail} />
      <MailDisplay mail={currentMail} />
    </div>
  );
}
