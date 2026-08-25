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
const mono = readFileSync(join(process.cwd(), 'src/assets/fonts/ibm-plex-mono-400.ttf'))

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
          backgroundColor: '#131313',
        },
        children: [
          { type: 'div', props: { style: { height: 2, backgroundColor: '#2a2a2a' } } },
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
                      fontFamily: 'IBM Plex Mono',
                      fontSize: 24,
                      color: '#8fb0d9',
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
                      color: '#e6e3de',
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
                      fontFamily: 'IBM Plex Mono',
                      fontSize: 24,
                      lineHeight: 1.5,
                      color: '#a3a09a',
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
                fontFamily: 'IBM Plex Mono',
                fontSize: 22,
              },
              children: [
                {
                  type: 'div',
                  props: { style: { color: '#e6e3de' }, children: 'Mykhaylo Kolesnik' },
                },
                { type: 'div', props: { style: { color: '#8fb0d9' }, children: 'kolesnik.io' } },
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
        { name: 'IBM Plex Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  )
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } })
}
