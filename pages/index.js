import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/layout';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi, I'm Greg. I am currently a Software Test Engineer at Backstop Solutions Group</p>
        <p>I am learning React and hope to become a front-end developer.</p>
      </section>
    </Layout>
  );
}