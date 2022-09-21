import Container from 'components/Container';
import Socials from 'components/Socials';
import Link from 'next/link';

export default function Navbar({ blog }) {
  return (
    <div className="fixed z-10 w-full bg-white border-b">
      <Container>
        <div className="flex justify-between w-full py-4 ">
          <Link href="/" passHref>
            <div className='flex items-center space-x-4'>
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
          <Socials blog={blog} />
        </div>
      </Container>
    </div>
  );
}
