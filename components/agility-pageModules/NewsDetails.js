import React from 'react'
import { renderHTML } from '@agility/nextjs'

const NewsDetails = ({ dynamicPageItem }) => {
  console.log(dynamicPageItem)
  const { fields } = dynamicPageItem
  return (
    <div className='container mx-auto px-8 my-8'>
        <h1 className='text-3xl'>{fields.title}</h1>
        <p className='my-2'>Categories: {fields.categories.map((cat) => cat.fields.category)}</p>
        <p>Author: {fields.author.fields.author}</p>
        <div className='my-2' dangerouslySetInnerHTML={renderHTML(fields.content)} />
    </div>
  )
}

export default NewsDetails