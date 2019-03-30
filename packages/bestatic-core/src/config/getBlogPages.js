import React from 'react'

export function makePageRoutes({
  items,
  pageSize,
  pageToken = 'page',
  route,
  decorate
}) {
  const itemsCopy = [...items] // Make a copy of the items
  const pages = [] // Make an array for all of the different pages

  while (itemsCopy.length) {
    // Splice out all of the items into separate pages using a set pageSize
    pages.push(itemsCopy.splice(0, pageSize))
  }

  const totalPages = pages.length

  // Move the first page out of pagination. This is so page one doesn't require a page number.
  const firstPage = pages.shift()

  return {
    ...decorate(firstPage, 1, totalPages), // and only pass the first page as data
    ...route,
    children: pages.map((page, i) => ({
      ...route, // route defaults
      path: `${route.path}/${pageToken}/${i + 1}`,
      ...decorate(page, i + 1, totalPages)
    }))
  }
}

export function getBlogPages({
  Layout,
  Component,
  items,
  pageSize = 5,
  name = 'blog',
  pageToken = 'page',
  itemToken = 'post'
}) {
  const blogPages = makePageRoutes({
    items,
    pageSize,
    pageToken,
    route: {
      // Use this route as the base route
      meta: { name },
      blog: true,
      Root: Layout,
      path: `/${name}`,
      exact: false,
      menu: false,
      Component: ({ loading, posts, currentPage, totalPages, match }) =>
        loading ? 'Is Loading' : <Component items={posts} />
    },
    decorate: (items, pageIndex, totalPages) => ({
      // For each page, supply the posts, page and totalPages
      getData: () => ({
        posts: items,
        currentPage: pageIndex,
        totalPages
      }),
      meta: { name: pageIndex },
      nextPage: `older ${itemToken}s`,
      previousPage: pageIndex < totalPages - 1 ? `newer ${itemToken}s` : ' ',
      Root: undefined
    })
  })

  blogPages.children = blogPages.children.concat(
    items.map((post, i) => ({
      meta: { name: post.title },
      blog: true,
      path: `${blogPages.path}/${itemToken}/${i + 1}`,
      Component: ({ loading, post }) =>
        loading ? 'Is Loading' : <Component {...post} />,
      getData: async () => ({ post }),
      nextPage: i == 0 ? ' ' : undefined
    }))
  )

  return Promise.resolve([blogPages])
}
