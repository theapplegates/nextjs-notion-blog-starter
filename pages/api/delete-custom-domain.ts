import axios from 'axios';
import prisma from 'lib/prisma';

const createCustomDomain = async (req: any, res: any) => {
  const { id, customDomain } = req.body;

  try {
    const config: any = {
      url: `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${customDomain}`,
      method: 'delete',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    await axios(config);
    await prisma.blogWebsite.update({
      where: {
        id
      },
      data: {
        customDomain: null
      }
    });

    return res.status(200).json('deleted');
  } catch (error) {
    console.log(error.data);

    return res.status(401).json(error);
  }
};

export default createCustomDomain;
