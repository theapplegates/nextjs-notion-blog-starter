import Image from 'next/image';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconHome
} from '@tabler/icons';

export default function Socials({ blog }) {
  const socials = [
    {
      name: 'Twitter',
      href: blog?.twitter,
      icon: <IconBrandTwitter className="w-6 text-gray-400 transition cursor-pointer hover:text-gray-600" />
    },
    {
      name: 'GitHub',
      href: blog?.github,
      icon: <IconBrandGithub className="w-6 text-gray-400 transition cursor-pointer hover:text-gray-600" />
    },
    {
      name: 'LinkedIn',
      href: blog?.linkedin,
      icon: <IconBrandLinkedin className="w-6 text-gray-400 transition cursor-pointer hover:text-gray-600" />
    }
  ];

  return (
    <div className="flex justify-center space-x-6 md:order-2">
      {socials.map(item => (
        <a
          key={item.name}
          href={item.href}
          className="text-gray-400 transform hover:text-gray-500 filter hover:contrast-0"
          target="_blank"
          rel="noreferrer"
        >
          <span className="sr-only">{item.name}</span>
          {item.icon}
        </a>
      ))}
    </div>
  );
}
