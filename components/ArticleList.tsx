import { Article } from 'lib/types';
import ArticleCard from './ArticleCard';

type Props = {
  articles: Article[];
};

export default function ArticleList({ articles, route }: any) {
  return (
    <div className="grid gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map(article => (
        <ArticleCard article={article} key={article.id} route={route} />
      ))}
    </div>
  );
}
