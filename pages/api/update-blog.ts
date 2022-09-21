import { getSession } from 'next-auth/react';
import prisma from 'utils/prisma';

const updateBlog = async (req: any, res: any) => {
  try {
    const {
      id,
      slug,
      headerTitle,
      profileUrl,
      headerDescription,
      footerText,
      ogBanner,
      github,
      twitter,
      linkedin,
      notionSecret,
      notionBlogDatabaseId,
    } = req.body;

    const session = await getSession({ req });

    if (!session?.user?.email) {
      return res.status(401);
    }

    const blog = await prisma.blogWebsite.findFirst(id)


    if(blog.email !== session?.user?.email) {
      return res.status(402);
    }

    const profile = await prisma.blogWebsite.update({
      where: {
        id
      },
      data: {
        updatedAt: new Date(),
        email: blog.email,
        slug,
        headerTitle,
        profileUrl,
        headerDescription,
        footerText,
        ogBanner,
        github,
        twitter,
        linkedin,
        notionSecret,
        notionBlogDatabaseId,
  
      }
    });

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
};

export default updateBlog;
