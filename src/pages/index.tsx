// SPDX-License-Identifier: Apache-2.0
import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import LandingIllustration, {
  type IllustrationName,
} from '@site/src/components/LandingIllustration';
import HeroHoneycomb from '@site/src/components/HeroHoneycomb';
import ModelCubes from '@site/src/components/WhatsNewArt/ModelCubes';
import BlogArticles from '@site/src/components/WhatsNewArt/BlogArticles';
import {useBlogPostsData} from '@site/src/components/Blog/utils';

import styles from './index.module.css';

type Card = {
  id: IllustrationName;
  title: string;
  description: string;
  to: string;
  tags: string[];
};

// translate() calls need static ids and messages so `write-translations`
// can extract them.
function useCards(): Card[] {
  return [
    {
      id: 'models',
      title: translate({id: 'homepage.cards.models.title', message: 'Models'}),
      description: translate({
        id: 'homepage.cards.models.description',
        message:
          'Find Granite models, run them locally or in the cloud, and verify their authenticity.',
      }),
      to: '/models',
      tags: [
        translate({id: 'homepage.cards.tags.models', message: 'Models'}),
        translate({id: 'homepage.cards.tags.tools', message: 'Tools'}),
        translate({id: 'homepage.cards.tags.tutorials', message: 'Tutorials'}),
      ],
    },
    {
      id: 'tools',
      title: translate({id: 'homepage.cards.tools.title', message: 'Tools'}),
      description: translate({
        id: 'homepage.cards.tools.description',
        message:
          'Explore Granite.build, Granite.mem, Granite.loop, Alchemy, and Prompt2Program.',
      }),
      to: '/tools',
      tags: [
        translate({id: 'homepage.cards.tags.graniteBuild', message: 'Granite.build'}),
        translate({id: 'homepage.cards.tags.graniteMem', message: 'Granite.mem'}),
        translate({id: 'homepage.cards.tags.graniteLoop', message: 'Granite.loop'}),
        translate({id: 'homepage.cards.tags.alchemy', message: 'Alchemy'}),
        translate({id: 'homepage.cards.tags.prompt2Program', message: 'Prompt2Program'}),
      ],
    },
    {
      id: 'tutorials',
      title: translate({id: 'homepage.cards.tutorials.title', message: 'Tutorials'}),
      description: translate({
        id: 'homepage.cards.tutorials.description',
        message:
          'Learn from working examples and artifacts created by the community.',
      }),
      to: '/tutorials',
      tags: [
        translate({id: 'homepage.cards.tags.examples', message: 'Examples'}),
        translate({id: 'homepage.cards.tags.communityArtifacts', message: 'Community Artifacts'}),
      ],
    },
    {
      id: 'blogs',
      title: translate({id: 'homepage.cards.blogs.title', message: 'Blogs'}),
      description: translate({
        id: 'homepage.cards.blogs.description',
        message: 'News, announcements, and deep dives from the Granite team.',
      }),
      to: '/blog',
      tags: [
        translate({id: 'homepage.cards.tags.blogModels', message: 'Models'}),
        translate({id: 'homepage.cards.tags.blogTools', message: 'Tools'}),
        translate({id: 'homepage.cards.tags.community', message: 'Community'}),
      ],
    },
  ];
}

// "Explore what's new" content (Figma nodes 142:9778 and 187:20643). Replace with live data when it is available.
const latestModels = [
  {
    name: 'ibm-granite/granite-4.1-3b-llmon-preview',
    tags: ['Text Generations', 'Transformers'],
  },
  {
    name: 'ibm-granite/granite-4.1-8b-base',
    tags: ['Text Generations', 'Transformers', 'Transformer'],
  },
  {
    name: 'ibm-granite/granite-speech-5.0-470m-turboctc',
    tags: ['Automatic Speech Recognition', 'Transformers'],
  },
];

function LandingCard({id, title, description, to, tags}: Card) {
  const arrow = useBaseUrl('/img/landing/arrow-up-right.svg');
  return (
    <article className={styles.card}>
      <Link to={to} className={styles.cardLink}>
        <div className={styles.cardMedia}>
          <LandingIllustration name={id} />
        </div>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDescription}>{description}</p>
      </Link>
      <div className={styles.cardFooter}>
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        <Link
          to={to}
          className={styles.explore}
          aria-label={translate(
            {
              id: 'homepage.cards.explore.ariaLabel',
              message: 'Explore {title}',
              description: 'Accessible name of a card button; {title} is the card title',
            },
            {title},
          )}>
          <Translate id="homepage.cards.explore" description="Card button label">
            Explore
          </Translate>
          <img src={arrow} width={16} height={16} alt="" />
        </Link>
      </div>
    </article>
  );
}

function Item({
  icon,
  title,
  to,
  children,
}: {
  icon: string;
  title: string;
  to: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link to={to} className={styles.item}>
        <img src={icon} width={32} height={32} alt="" />
        <span className={styles.itemTitle}>{title}</span>
        {children}
      </Link>
    </li>
  );
}

function WhatsNew() {
  const modelIcon = useBaseUrl('/img/landing/icon-model-alt-32.svg');
  // The three newest blog posts (src/plugins/blogPostsData.ts).
  const recentArticles = useBlogPostsData().posts.slice(0, 3);
  return (
    <section className={styles.whatsNew}>
      <Heading as="h2" className={styles.sectionTitle}>
        <Translate id="homepage.whatsNew.title">Explore what’s new</Translate>
      </Heading>
      <div className={styles.group}>
        <Heading as="h3" className={styles.columnTitle}>
          <Translate id="homepage.whatsNew.models">Latest Models</Translate>
        </Heading>
        <div className={styles.row}>
          <ModelCubes />
          <ul className={styles.list}>
            {latestModels.map((model) => (
              <Item
                key={model.name}
                icon={modelIcon}
                title={model.name}
                to={`https://huggingface.co/${model.name}`}>
                <span className={styles.itemTags}>
                  {model.tags.map((tag) => (
                    <span key={tag} className={styles.grayTag}>
                      {tag}
                    </span>
                  ))}
                </span>
              </Item>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.group}>
        <Heading as="h3" className={styles.columnTitle}>
          <Translate id="homepage.whatsNew.articles">Recent Articles</Translate>
        </Heading>
        <div className={styles.row}>
          <BlogArticles />
          <ul className={styles.list}>
            {recentArticles.map((article) => (
              <Item
                key={article.permalink}
                icon={modelIcon}
                title={article.title}
                to={article.permalink}>
                <span className={styles.itemSummary}>{article.description}</span>
              </Item>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const cards = useCards();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.landing}>
        <HeroHoneycomb className={styles.honeycomb} />
        <header className={styles.hero}>
          <Heading as="h1" className={styles.heroTitle}>
            <Translate
              id="homepage.hero.title"
              description="Hero heading; {lineBreak} starts the second line"
              values={{
                lineBreak: <br />,
                product: (
                  <strong>
                    <Translate id="homepage.hero.title.product">
                      IBM Granite
                    </Translate>
                  </strong>
                ),
              }}>
              {'Welcome to{lineBreak}{product} Docs'}
            </Translate>
          </Heading>
          <p className={styles.heroSubtitle}>
            <Translate id="homepage.hero.subtitle">
              Your documentation hub for all of the latest granite resources.
            </Translate>
          </p>
          <p className={styles.heroLead}>
            <Translate id="homepage.hero.lead">Get started here.</Translate>
          </p>
        </header>
        <div className={styles.cards}>
          {cards.map((card) => (
            <LandingCard key={card.id} {...card} />
          ))}
        </div>
        <hr className={styles.divider} />
        <WhatsNew />
      </main>
    </Layout>
  );
}
