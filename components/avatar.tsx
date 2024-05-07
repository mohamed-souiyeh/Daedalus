import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faAddressCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Bounce, toast } from "react-toastify";

export const MyAvatar = () => {
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("mohamedsouiyeh3@gmail.com");
      toast.success('Email copied successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }
  return (
    <>
      <div id="avatar" className="avatar">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform avatar"
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
            {
              // <DropdownItem key="email" className="h-14 gap-2" onClick={copyEmail}>
              //   <p className="font-semibold">mohamedsouiyeh3@gmail.com</p>
              //   </DropdownItem>
            }
            <DropdownItem startContent={<FontAwesomeIcon icon={faAddressCard} size="lg" />} key="portfolio" href="https://medsouiyeh.tech/" target="_blank">Portfolio</DropdownItem>
            <DropdownItem startContent={<FontAwesomeIcon icon={faLinkedin} size="lg" />} key="Linkedin" href="https://www.linkedin.com/in/m-souiyeh/" target="_blank">Linkedin Profile</DropdownItem>
            <DropdownItem startContent={<FontAwesomeIcon icon={faGithub} size="lg" />} key="Github" href="https://github.com/mohamed-souiyeh" target="_blank">Github Profile</DropdownItem>
            {
              // <DropdownItem key="analytics">Analytics</DropdownItem>
              // <DropdownItem key="system">System</DropdownItem>
              // <DropdownItem key="configurations">Configurations</DropdownItem>
              // <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            }
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};
