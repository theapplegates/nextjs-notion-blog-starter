import axios from 'axios';
import prisma from 'utils/prisma';

const createCustomDomain = async (req: any, res: any) => {
  const { id, customDomain } = req.body;

  try {
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('creating domain', customDomain, id);

    await axios.post(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      { name: customDomain },
      options
    );

    await prisma.blogWebsite.update({
      where: {
        id
      },
      data: {
        customDomain
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default createCustomDomain;
