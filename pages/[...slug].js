import Layout from "components/common/Layout";
import { getAgilityPageProps, getAgilityPaths } from "@agility/nextjs/node";
import { getModule } from "components/agility-pageModules";
import SiteHeader from "components/common/SiteHeader";
import aglty from "@agility/content-fetch"

// getStaticProps function fetches data for all of your Agility Pages and Next.js will pre-render these pages at build time
export async function getStaticProps({
  preview,
  params,
  locale,
  defaultLocale,
  locales,
}) {
  // place all global here
  const globalComponents = {
    header: SiteHeader,
  };


  // set up content hub item
  let contentHubItem = null

  // if we have params, and params.slug.length is 2, and first param is news, then we are on a news page
  if (params && params.slug.length === 2 && params.slug[0] === "news") {

    // set up api for content hub
    const api = aglty.getApi({
      guid: process.env.CONTENT_HUB_GUID,
      apiKey: preview ? process.env.CONTENT_HUB_API_PREVIEW_KEY : process.env.CONTENT_HUB_API_FETCH_KEY,
      isPreview: preview
    })
  
    // get content hub item equal to slug we're on
    const news = await api.getContentList({
      referenceName: "news",
      locale: 'en-us',
      filters: [
        {property: 'fields.audience_TextField', operator: api.types.FilterOperators.LIKE, value: '"National Training"'},
        {property: 'fields.slug', operator: api.types.FilterOperators.EQUAL_TO, value: `"${params.slug[1]}"`},
      ]
    })


    // if news item is empty, return not found
    if (news.items.length === 0) {
      return {
        props: {
          notFound: true
        }
      }
    } else {
      // set content hub item equal to news item
      contentHubItem = news.items[0]

      // set params.slug to news-details path
      params.slug[1] = "news-details"
    }

  }

  const agilityProps = await getAgilityPageProps({
    preview,
    params,
    locale,
    getModule,
    defaultLocale,
    globalComponents,
  });

  if (!agilityProps) {
    // We throw to make sure this fails at build time as this is never expected to happen
    throw new Error(`Page not found`);
  }

  // if we have a content hub item, add contentHubItem to dynamicPageItem prop
  if (contentHubItem !== null){
    agilityProps.dynamicPageItem = contentHubItem
  }  

  return {
    // return all props
    props: agilityProps,
    // Next.js will attempt to re-generate the page when a request comes in, at most once every 10 seconds
    // Read more on Incremental Static Regenertion here: https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
    revalidate: 10,
  };
}

// Next.js will statically pre-render all the paths from Agility CMS
export async function getStaticPaths({ locales, defaultLocale }) {

  //get the paths configured in agility
  let agilityPaths = await getAgilityPaths({
    preview: false,
    locales,
    defaultLocale,
  });

  // set up api for content hub
  const api = aglty.getApi({
    guid: process.env.CONTENT_HUB_GUID,
    apiKey: process.env.CONTENT_HUB_API_FETCH_KEY,
  })

  // make call to get all news item slugs from content hub
  const news = await api.getContentList({
    referenceName: "news",
    locale: 'en-us',
    filters: [
      {property: 'fields.audience_TextField', operator: api.types.FilterOperators.LIKE, value: '"National Training"'},
    ],
    sort: 'fields.date',
    direction: api.types.SortDirections.DESC,
  })

  // add news items to agility paths
  const newsPaths = news.items.map((item) => {
    return `/news/${item.fields.slug}`
  })

  agilityPaths.push(...newsPaths)

  return {
    paths: agilityPaths,
    fallback: true,
  };
}

const AgilityPage = (props) => {
  return <Layout {...props} />;
};

export default AgilityPage;
