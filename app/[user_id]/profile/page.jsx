import ProfileCalender from './profile-calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink, MailOpen, Mails, MapPin, Phone } from 'lucide-react';

export default function ProfilePage() {
  const verticalGradient =
    'linear-gradient(to bottom, #74DB4E 0%, #4696A2 40%, #4E3ABA 100%)';

  return (
    <div className="flex h-screen w-full flex-col justify-center gap-10 px-64 py-24">
      <div className="flex h-[300px] w-full items-center justify-between py-6">
        <div className="flex w-full gap-5">
          <Avatar className="h-[211px] w-[211px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold">Juan C. Dela Cruz</h1>
            <h3 className="text-lg">@juan123</h3>
            <h3 className="text-lg">Course</h3>
            <h3 className="text-lg">This is my Bio (Optional, 160 words)</h3>
          </div>
        </div>
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-full w-[260px] flex-col gap-3 rounded-md bg-[#EDEDED] p-5">
            <span className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Contact Me</h1>
              <MailOpen />
            </span>
            <div className="flex flex-col gap-3 text-slate-700">
              <span className="flex items-center gap-2">
                <MapPin size={14} />
                <h1 className="text-sm">School</h1>
              </span>
              <span className="flex items-center gap-2">
                <ExternalLink size={14} />
                <h1 className="text-sm">Link</h1>
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} />
                <h1 className="text-sm">Number</h1>
              </span>
              <span className="flex items-center gap-2">
                <Mails size={14} />
                <h1 className="text-sm">Email</h1>
              </span>
            </div>
          </div>
          <Button className="w-full">Edit Profile</Button>
        </div>
      </div>
      <div className="flex h-[350px] justify-between">
        <div className="h-full">
          <ProfileCalender />
        </div>
        <div
          className="flex w-[320px] flex-col items-center justify-center rounded-md"
          style={{ backgroundImage: verticalGradient }}
        >
          <div className="flex flex-col gap-1">
            <div className="mb-2 h-5 w-5 rounded-full bg-white"></div>
            <h1 className="text-2xl font-bold text-white">Book a New Room</h1>
            <h3 className="w-[128px] text-[16px] leading-none text-[#E2E8F0]">
              Click here to reserve a new room.
            </h3>
          </div>
        </div>
        <div className="flex h-full w-[370px] flex-col justify-between p-5">
          <div className="flex flex-col gap-2 text-lg">
            <h2 className="font-medium">
              View or Edit all of your reservations
            </h2>
            <h2 className="text-[#64748B]">
              Access here to edit and view your current reservations
            </h2>
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <h2 className="font-medium">Discover New MoRoomies</h2>
            <h2 className="text-[#64748B]">
              Find other User in your Institution
            </h2>
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <h2 className="font-medium">Browse the Rooms</h2>
            <h2 className="text-[#64748B]">
              Access the availability and description of the rooms
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
