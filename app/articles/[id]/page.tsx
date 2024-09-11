'use client';

import { useEffect, useState } from 'react';
import Card from '@/src/components/Card';

interface Article {
  id: string;
  title: string;
  content: string;
  imageSrc: string;
  color: string;
}

const ArticleDetailPage = ({ params }: { params: { id: string } }) => {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchedArticle = {
      id: params.id,
      title: 'Article Title',
      content: 'Detailed content of the article.',
      imageSrc: 'https://i.ytimg.com/vi/ZjfHFftdug0/maxresdefault.jpg',
      color: '#4E614E',
    };
    setArticle(fetchedArticle);
  }, [params.id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card
        backgroundColor={article.color}
        title={article.title}
        imageSrc={article.imageSrc}
      />
      <p className="mt-4">{article.content}</p>
    </div>
  );
};

export default ArticleDetailPage;
