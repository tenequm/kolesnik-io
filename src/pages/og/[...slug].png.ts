import { getCollection } from 'astro:content'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { APIContext, InferGetStaticPropsType } from 'astro'
import satori from 'satori'
import sharp from 'sharp'

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  )
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}

// Read from the project root: this endpoint only runs at build time.
const serif = readFileSync(join(process.cwd(), 'src/assets/fonts/source-serif-4-600.ttf'))
const sans = readFileSync(join(process.cwd(), 'src/assets/fonts/ibm-plex-sans-400.ttf'))

const fmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export async function GET({ props }: APIContext<Props>) {
  const { post } = props
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f7f3ec',
        },
        children: [
          { type: 'div', props: { style: { height: 14, backgroundColor: '#3d5a80' } } },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                padding: '72px 96px',
                justifyContent: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'IBM Plex Sans',
                      fontSize: 26,
                      color: '#3d5a80',
                      marginBottom: 28,
                    },
                    children: fmt.format(post.data.pubDate),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Source Serif 4',
                      fontSize: 58,
                      lineHeight: 1.15,
                      color: '#1c1815',
                      letterSpacing: '-0.5px',
                      lineClamp: 3,
                      marginBottom: 30,
                    },
                    children: post.data.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'IBM Plex Sans',
                      fontSize: 28,
                      lineHeight: 1.45,
                      color: '#6b6358',
                      lineClamp: 2,
                    },
                    children: post.data.description,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 96px 56px',
                fontFamily: 'IBM Plex Sans',
                fontSize: 24,
              },
              children: [
                {
                  type: 'div',
                  props: { style: { color: '#1c1815' }, children: 'Mykhaylo Kolesnik' },
                },
                { type: 'div', props: { style: { color: '#3d5a80' }, children: 'kolesnik.io' } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Source Serif 4', data: serif, weight: 600, style: 'normal' },
        { name: 'IBM Plex Sans', data: sans, weight: 400, style: 'normal' },
      ],
    },
  )
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } })
}
