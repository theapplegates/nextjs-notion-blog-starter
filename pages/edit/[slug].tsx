import { getSession, signIn } from 'next-auth/react';
import axios, { AxiosRequestConfig } from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import EditForm from '../../components/EditForm';
import Container from '../../components/Container';
import prisma, { blogSelect } from 'utils/prisma';

export default function Index({ blog, session }: any) {
  const { register, handleSubmit, setValue, watch, control } = useForm({
    defaultValues: blog
  });
  const router = useRouter();

  if (!session) {
    console.log('no session');
    return (
      <div className="flex-shrink-0 order-3 w-full mt-2 sm:order-2 sm:mt-0 sm:w-auto">
        <div
          onClick={e => {
            e.preventDefault();
            signIn('google', { callbackUrl: '/edit' });
          }}
        >
          <button>
            <div className="flex items-center space-x-2">
              <img src="/icons/google.svg" className="w-4 h-4" />
              <div>Get started</div>
            </div>
          </button>
        </div>
      </div>
    );
  }
  const onSubmitForm = async (values: any) => {
    const config: AxiosRequestConfig = {
      url: blog?.slug ? '/api/update-blog' : '/api/create-blog',
      data: { ...values, id: blog.id },
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios(config);
    if (res.status === 200) {
      router.reload();
    }
  };

  const editFormProps = {
    blog,
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmitForm,
    session,
    control
  };

  return (
    <div>
      <div className="pt-24 pb-16 bg-gray-100">
        <Container>
          <div className="flex justify-center lg:space-x-8">
            <EditForm {...editFormProps} />
          </div>
        </Container>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const { slug } = context.query;

  const session = await getSession(context);

  console.log('session', session);

  if (!session?.user?.email) {
    return {
      props: {
        session: null,
        blog: null
      }
    };
  }

  const blog = await prisma.blogWebsite.findFirst({
    where: { slug },
    select: { ...blogSelect, id: true }
  });

  console.log(blog);

  return {
    props: {
      session,
      blog
    }
  };
};
