import aglty from "@agility/content-fetch"
import React from 'react'
import Link from "next/link"

const NewsListing = ({ module, customData }) => {
  const { news } = customData
  return (
    <div className="container mx-auto">
      {news.map((item) => {
        return (
          <div>
            <Link href={`/news/${item.slug}`}>
              {item.title}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default NewsListing

NewsListing.getCustomInitialProps = async ({ agility }) => {

  const { isPreview } = agility.config
  
  const api = aglty.getApi({
    guid: process.env.CONTENT_HUB_GUID,
    apiKey: isPreview ? process.env.CONTENT_HUB_API_PREVIEW_KEY : process.env.CONTENT_HUB_API_FETCH_KEY,
    isPreview
  })

  try {
    const rawNews = await api.getContentList({
      referenceName: "news",
      locale: 'en-us',
      filters: [
        {property: 'fields.audience_TextField', operator: api.types.FilterOperators.LIKE, value: '"National Training"'},
      ],
      sort: 'fields.date',
      direction: api.types.SortDirections.DESC
    })

    const news = rawNews.items.map((item) => {
      return {
        title: item.fields.title,
        slug: item.fields.slug,
        date: item.fields.date,
        author: item.fields.author,
        categories: item.fields.categories,
        audience: item.fields.audience,
        content: item.fields.content,
      }
    })

    return {
      news
    }

  } catch (err){
    console.log(err)
  }
}