import axios from 'axios';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import prisma, { blogSelect } from 'utils/prisma';

export default function Index({ blogs }) {
  console.log(blogs);
  const router = useRouter();

  const removeBlog = async (id: any) => {
    const config: any = {
      url: '/api/delete-blog',
      data: { id },
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
  return (
    <div>
      <div className="h-screen">
        <div className="w-11/12 max-w-screen-lg mx-auto">
          <div className="flex justify-between pt-10 pb-8">
            <div className="text-3xl font-semibold leading-6 text-gray-900">My blog</div>

            <Link href="/subscription" passHref>
              <button>Go Premium</button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link passHref href={`/new`}>
              <div className="flex min-h-[200px] items-center justify-center col-span-1 p-4 border-2 border-gray-300 border-dashed rounded cursor-pointer">
                <div className="inline-flex items-center justify-center p-5 text-[24px] text-white bg-gray-400 rounded-full h-[50px] w-[50px]">
                  +
                </div>
              </div>
            </Link>

            {blogs.length > 0 &&
              blogs.map(directory => (
                <Link key={directory.id} passHref href={`/edit/${directory.slug}`}>
                  <div className="col-span-1 p-4 bg-white border rounded shadow cursor-pointer">
                    <div>
                      <div className="w-full">
                        <div className="bg-blue-50 rounded border flex justify-center items-center h-[150px] text-xl font-bold text-gray-800 cursor-pointer ">
                          {directory?.slug}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-semibold text-[14px]">
                          {directory?.slug}.nocodelist.io
                        </div>
                        <div
                          className=" text-[14px] text-gray-400"
                          onClick={e => {
                            if (confirm('Are you sure to remove this blog?') == true) {
                              removeBlog(directory.id);
                            }
                            e.preventDefault();
                          }}
                        >
                          delete
                        </div>
                      </div>

                      <div className="text-[14px] text-gray-500">{directory.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  console.log(session);

  const blogs = await prisma.blogWebsite.findMany({
    where: { email: session?.user.email },
    select: { ...blogSelect, id: true }
  });

  console.log(blogs);

  return { props: { session, blogs } };

  // return {
  //   props: {
  //     blog,
  //     articles,
  //     categories
  //   }
  // };
}
