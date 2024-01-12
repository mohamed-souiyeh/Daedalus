import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";

export const MyAvatar = () => {
  return (
    <>
      <div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="mohamed y. souiyeh"
              size="md"
              radius="sm"
              showFallback
              fallback={<FontAwesomeIcon icon={faUser} size="2xl" />}
              src="https://avatars.githubusercontent.com/u/75757774?v=4"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="email" className="h-14 gap-2">
              <p className="font-semibold">mohamedsouiyeh3@gmail.com</p>
            </DropdownItem>
            <DropdownItem key="portfolio">Portfolio</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};