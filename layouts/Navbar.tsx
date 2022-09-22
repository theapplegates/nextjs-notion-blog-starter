import { IconMoon } from '@tabler/icons';
import Container from 'components/Container';
import Socials from 'components/Socials';
import Link from 'next/link';

export const navSettings = {
  links: [
    // { name: 'home', url: 'https://phung.io/', template: 1 },
    { name: 'Articles', url: '/', template: 3, isDefault: true },
    { name: 'Projects', url: '/projects', isDefault: false },
    { name: 'Snippets', url: '/snippets', template: 2, isDefault: false }
  ]
};

export default function Navbar({ blog }) {
  return (
    <div className="fixed z-10 w-full bg-white border-b">
      <Container>
        <div className="flex justify-between w-full py-4 ">
          <Link href="/" passHref>
            <div className="flex items-center space-x-4">
              {blog?.profileUrl && (
                <img
                  src={blog.profileUrl}
                  className="w-8 h-8 mx-auto rounded-full"
                  alt="profile"
                />
              )}
              <div className="text-xl font-bold cursor-pointer">{blog?.blogName}</div>
            </div>
          </Link>
          <div className="flex items-center space-x-8 cursor-pointer">
            <div className="flex space-x-4">
              {navSettings.links.map(item => (
                <Link key={item.url} href={item.url}>
                  <div className="p-1 font-medium text-gray-900">{item.name}</div>
                </Link>
              ))}
            </div>
            <IconMoon />
            {/* <Socials blog={blog} /> */}
          </div>
        </div>
      </Container>
    </div>
  );
}
