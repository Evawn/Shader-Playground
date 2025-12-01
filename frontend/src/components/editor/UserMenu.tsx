// User menu component showing sign in button or user dropdown with profile options
import { Button } from '../ui/button';
import { Dropdown } from '../ui/Dropdown';
import type { DropdownOption } from '../ui/Dropdown';
import { UserCircle, Image, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  isSignedIn: boolean;
  username?: string;
  userPicture?: string;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function UserMenu({
  isSignedIn,
  username,
  userPicture,
  onSignIn,
  onSignOut,
}: UserMenuProps) {
  const navigate = useNavigate();

  if (!isSignedIn || !username) {
    // Show Sign In button when not signed in
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 py-1 text-sm font-light text-foreground bg-transparent hover:text-foreground-highlighted hover:bg-background-highlighted focus:outline-none rounded-md flex items-center gap-1"
        onClick={onSignIn}
      >
        <UserCircle className="w-4 h-4" />
        <span className="hidden md:inline">Sign In</span>
      </Button>
    );
  }

  // Show user menu when signed in
  const dropdownOptions: DropdownOption[] = [
    {
      text: 'My Shaders',
      callback: () => {
        navigate(`/gallery?search=${username}`);
      },
      icon: Image,
    },
    {
      text: 'Sign Out',
      callback: () => {
        onSignOut();
      },
      icon: LogOut,
    },
  ];

  return (
    <Dropdown options={dropdownOptions}>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 py-1 text-sm font-light text-foreground bg-transparent hover:text-foreground-highlighted hover:bg-background-highlighted focus:outline-none rounded-md flex items-center gap-1"
      >
        {userPicture ? (
          <img
            src={userPicture}
            alt={username}
            className="w-5 h-5 rounded-full"
          />
        ) : (
          <UserCircle className="w-4 h-4" />
        )}
        <span className="hidden md:inline">{username}</span>
      </Button>
    </Dropdown>
  );
}
