// One-off generator for the static site OG image (public/og.png).
// Run: node scripts/gen-og.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import satori from 'satori'
import sharp from 'sharp'

const serif = readFileSync(join(process.cwd(), 'src/assets/fonts/source-serif-4-600.ttf'))
const sans = readFileSync(join(process.cwd(), 'src/assets/fonts/ibm-plex-sans-400.ttf'))

const bg = '#f5efe6'
const ink = '#1a1a1a'
const inkMuted = '#5f5a52'
const accent = '#3d5a80'

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bg,
        borderTop: `16px solid ${accent}`,
        padding: '96px',
        justifyContent: 'flex-end',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Source Serif 4',
              fontSize: 64,
              color: ink,
              lineHeight: 1.1,
              marginBottom: 28,
            },
            children: 'I fix the infrastructure nobody owns.',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'IBM Plex Sans',
              fontSize: 32,
              color: inkMuted,
              lineHeight: 1.4,
              marginBottom: 48,
            },
            children: 'Mykhaylo Kolesnik. Senior infrastructure and AI-systems engineering.',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Source Serif 4',
              fontSize: 28,
              color: accent,
            },
            children: 'kolesnik.io',
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
writeFileSync(join(process.cwd(), 'public/og.png'), png)
console.log('public/og.png written', png.length, 'bytes')
