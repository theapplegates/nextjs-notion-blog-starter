import { getSession, signIn } from 'next-auth/react';
import axios, { AxiosRequestConfig } from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import EditForm from '../../components/EditForm';
import Container from '../../components/Container';
import prisma, { blogSelect } from 'utils/prisma';
import { useEffect, useState } from 'react';

export default function Index({ blog, session }: any) {
  const { register, handleSubmit, setValue, watch, control } = useForm({
    defaultValues: blog
  });
  const router = useRouter();

  const [domainConfig, setDomainConfig]: any = useState({});

  useEffect(() => {
    console.log(blog);
    if (blog?.customDomain) {
      const options = {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      };

      const data = axios.get(
        `https://api.vercel.com/v4/domains/${blog.customDomain}/config`,
        options
      );

      data.then(({ data }) => setDomainConfig(data));
    }
  }, [blog]);

  console.log(domainConfig);

  if (!session) {
    console.log('no session');
    return (
      <div className="flex-shrink-0 order-3 w-full mt-2 sm:order-2 sm:mt-0 sm:w-auto">
        <div
          onClick={e => {
            e.preventDefault();
            signIn('google', { callbackUrl: '/' });
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

            <div>
              <div className="space-y-4 text-center">
                <div className="text-lg font-medium leading-6 text-gray-900">
                  Follow these instructions:
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    You can map your domain to Nocodelist by adding the following DNS
                    record.{' '}
                  </p>
                </div>

                {blog?.customDomain && (
                  <div className="p-6 text-left border rounded xl:w-3/4 dark:border-gray-800">
                    <div className="justify-between md:flex">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          You are using custom domain for your site
                        </p>
                        <div className="text-3xl font-medium truncate dark:text-gray-200">
                          {blog?.customDomain}
                        </div>

                        <dd className="flex items-center mt-3 text-sm font-normal text-gray-500 capitalize sm:mr-6 sm:mt-0">
                          <svg
                            className={`flex-shrink-0 mr-1.5 h-5 w-5 ${
                              domainConfig?.misconfigured
                                ? 'text-orange-400'
                                : 'text-green-400'
                            }`}
                            x-description="Heroicon name: solid/check-circle"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                          </svg>
                          {domainConfig?.misconfigured ? 'Misconfigured' : 'Live'}
                        </dd>
                      </div>

                      <div className="flex items-center">
                        <div
                          className="inline-flex items-center px-4 py-1 text-sm font-medium text-red-800 rounded cursor-pointer hover:bg-red-100"
                          onClick={async () => {
                            if (confirm('Are you sure you want to remove this domain?'))
                              // await deleteDomain({
                              //   customDomain: directory?.customDomain,
                              //   directoryId: directory.id
                              // });
                              return await axios({
                                url: '/api/delete-custom-domain',
                                data: { id: blog.id, customDomain: blog.customDomain },
                                method: 'post',
                                headers: {
                                  'Content-Type': 'application/json'
                                }
                              });
                          }}
                        >
                          <svg
                            className="w-4 h-4 mr-1 fill-red-800"
                            viewBox="0 0 448 512"
                          >
                            <path d="M296 432h16a8 8 0 008-8V152a8 8 0 00-8-8h-16a8 8 0 00-8 8v272a8 8 0 008 8zm-160 0h16a8 8 0 008-8V152a8 8 0 00-8-8h-16a8 8 0 00-8 8v272a8 8 0 008 8zM440 64H336l-33.6-44.8A48 48 0 00264 0h-80a48 48 0 00-38.4 19.2L112 64H8a8 8 0 00-8 8v16a8 8 0 008 8h24v368a48 48 0 0048 48h288a48 48 0 0048-48V96h24a8 8 0 008-8V72a8 8 0 00-8-8zM171.2 38.4A16.1 16.1 0 01184 32h80a16.1 16.1 0 0112.8 6.4L296 64H152zM384 464a16 16 0 01-16 16H80a16 16 0 01-16-16V96h320zm-168-32h16a8 8 0 008-8V152a8 8 0 00-8-8h-16a8 8 0 00-8 8v272a8 8 0 008 8z"></path>
                          </svg>
                          <span>Delete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <table className="w-full border table-auto">
                  <thead className="text-center bg-gray-200 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2">Record</th>
                      <th className="px-4 py-2">Host Name</th>
                      <th className="px-4 py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr>
                      <td className="px-4 py-2 border">A</td>
                      <td className="px-4 py-2 border">@</td>
                      <td className="px-4 py-2 border">76.76.21.21</td>
                    </tr>
                  </tbody>
                  <tbody className="text-center">
                    <tr>
                      <td className="px-4 py-2 border">CNAME</td>
                      <td className="px-4 py-2 border">www</td>
                      <td className="px-4 py-2 border">cname.vercel-dns.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

  return {
    props: {
      session,
      blog
    }
  };
};
