import { getSession } from 'next-auth/react';
import slugify from 'slugify';
import prisma from 'utils/prisma';

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const createBlog = async (req: any, res: any) => {
  try {
    const {
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

    if (!session?.user?.email || !session?.user?.name) {
      return res.status(401);
    }

    const random2Numbers = getRandomArbitrary(0, 100).toFixed();

    const autoSlug = slugify(session?.user?.name).toLowerCase() + random2Numbers;

    console.log('slug', slug)

    const profile = await prisma.blogWebsite.create({
      data: {
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
        slug: slug || autoSlug,
        email: session.user.email,
        user: { connect: { email: session.user.email } }
      }
    });


    return res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export default createBlog;
