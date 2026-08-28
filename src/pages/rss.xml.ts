import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )
  return rss({
    title: 'Mykhaylo Kolesnik',
    description: 'Notes on production AI-agent systems, data platforms, and infrastructure.',
    site: context.site ?? 'https://kolesnik.io',
    // build.format 'file' serves posts without a trailing slash; the default would 404
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}`,
    })),
  })
}
