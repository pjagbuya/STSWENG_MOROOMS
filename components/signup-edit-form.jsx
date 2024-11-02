import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignupEditForm({ userFirstName, userLastName, userSchoolId }) {
  console.log(userFirstName);
  return (
    <Card className="mx-auto w-[425px] max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Account</CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                name="user_first_name"
                id="first-name"
                type="text"
                placeholder="John"
                defaultValue={userFirstName}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input
                name="user_last_name"
                id="last-name"
                type="text"
                placeholder="Doe"
                defaultValue={userLastName}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school-id">School ID</Label>
              <Input
                name="user_school_id"
                id="school-id"
                type="text"
                placeholder="12201220"
                defaultValue={userSchoolId}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-8">
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
