import Image from 'next/image';
import Container from './Container';
import SubscribeInput from './SubscribeInput';

export default function HeroHeader({ blog }: any) {
  return (
    <div className="py-24 text-center bg-gray-100">
      <Container>
        {blog?.profileUrl && (
          <img
            src={blog.profileUrl}
            className="w-24 h-24 mx-auto rounded-full"
            alt="profile"
          />
        )}
        <div className="mt-4 text-3xl font-extrabold text-gray-900">
          {blog?.headerTitle}
        </div>
        <div className="max-w-2xl mx-auto mt-2 text-xl text-gray-500">
          {blog?.headerDescription}
        </div>

        <div className="mt-12">
          <SubscribeInput />
        </div>
      </Container>
    </div>
  );
}
