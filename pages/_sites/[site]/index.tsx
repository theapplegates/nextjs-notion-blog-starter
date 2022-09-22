import { IconSearch } from '@tabler/icons';
import ArticleList from 'components/ArticleList';
import Category from 'components/Category';
import Container from 'components/Container';
import HeroHeader from 'components/HeroHeader';
import { Layout } from 'layouts/Layout';
import { navSettings } from 'layouts/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { filterArticles } from 'utils/filterArticles';
import { convertToArticleList, getAllArticles } from 'utils/notion';
import prisma, { blogSelect } from 'utils/prisma';

export default function Index({ articles, categories, blog, routes, route }: any) {
  const [selectedTag, setSelectedTag] = useState<string>(null);
  const [searchValue, setSearchValue] = useState('');

  console.log('routes', routes);

  const filteredArticles = filterArticles(articles, selectedTag, searchValue);

  if (!blog) {
    return (
      <div>
        The subdomain page probably does not exist, please contact admin{' '}
        <Link href="/">go back to main page</Link>
      </div>
    );
  }

  return (
    <Layout blog={blog} routes={routes}>
      {blog?.headerTitle && <HeroHeader blog={blog} />}

      <Container>
        <div className="py-12">
          <div className="mb-10 space-y-4">
            <div className="mb-2 text-4xl font-bold text-gray-900 ">
              {!selectedTag
                ? `${
                    searchValue.length > 0 ? filteredArticles.length : 'Latest'
                  } ${route}`
                : `${selectedTag} ${route}`}
            </div>

            <div className="relative max-w-md">
              <input
                className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded"
                type="text"
                placeholder="Search articles"
                value={searchValue}
                onChange={(e: any) => {
                  const value = e.target.value;
                  setSelectedTag(null);
                  setSearchValue(value);
                }}
              />
              <IconSearch className="absolute w-5 text-gray-400 right-4 top-2" />
            </div>
            <div className="flex flex-wrap justify-start gap-4">
              {categories.map(tag => (
                <Category
                  tag={tag}
                  key={tag}
                  selectedTag={selectedTag}
                  setSearchValue={setSearchValue}
                  setSelectedTag={setSelectedTag}
                />
              ))}
            </div>
          </div>

          <ArticleList articles={filteredArticles} route={route} />
        </div>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const { site } = context.query;

    const route = navSettings.links
      .find(item => item.isDefault === true)
      .name.toLowerCase();

    console.log('site', site);

    if (!site) {
      return {
        props: {
          profile: null
        }
      };
    }

    const findOptions = site.includes('.') ? { customDomain: site } : { slug: site };

    const blog = await prisma.blogWebsite.findFirst({
      where: findOptions,
      select: blogSelect
    });

    if (!blog?.slug) {
      return {
        props: {
          profile: null
        }
      };
    }

    const data = await getAllArticles(
      blog.notionBlogDatabaseId,
      blog.notionSecret,
      route
    );

    const { articles, categories, routes } = convertToArticleList(data);

    return {
      props: {
        blog,
        articles,
        categories,
        routes,
        route
      }
    };
  } catch (error) {
    console.log(error);
    return;
  }
}
