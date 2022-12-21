import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { logger } from 'hono/logger'
import { validator } from 'hono/validator'
import HandleAccount from './webfinger'

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*',
  logger(),
  cache({ cacheName: 'webfinger', cacheControl: 'max-age=86400' }),
)

app.get(
  '/.well-known/webfinger',
  validator((v) => ({
    resource: v.query('resource').isRequired().message('Resource is required'),
  })),
  async (ctx) => {
    const { resource } = ctx.req.query()
    const { hostname } = new URL(ctx.req.url)

    const match = resource.toLocaleLowerCase().match(/^acct:([^@]+)@(.+)$/)
    if (!match) {
      console.log(`Webfinger resource ${resource} not supported`)
      return ctx.status(404)
    }

    const [, fingerUsername, fingerHost] = match
    if (fingerHost != hostname) {
      console.log(`${fingerHost} not matching`)
      return ctx.status(404)
    }

    const { ACCOUNTS, HOST_INFO } = ctx.env
    const account = await ACCOUNTS.get(`${fingerUsername}@${fingerHost}`).then(
      async (a) => a || (await ACCOUNTS.get(`*@${fingerHost}`)),
    )
    if (account) {
      const accountInfo = JSON.parse(account) as Account
      const hostInfo = (await HOST_INFO.get(
        accountInfo.host,
      )) as HostInfo | null
      if (hostInfo) {
        const finger = HandleAccount(accountInfo, hostInfo)
        if (finger) {
          return ctx.json(finger, 200, {
            'content-type': 'application/jrd+json',
          })
        }
      }
    }

    return ctx.status(404)
  },
)

export default app
