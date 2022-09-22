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

    await axios.delete(`https://api.vercel.com/v6/domains/${customDomain}`, options);

    await prisma.blogWebsite.update({
      where: {
        id
      },
      data: {
        customDomain: null
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default createCustomDomain;
