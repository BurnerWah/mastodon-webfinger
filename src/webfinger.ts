export function Mastodon(host: string, username: string): WebFinger {
  return {
    subject: `acct:${username}@${host}`,
    aliases: [
      `https://${host}/@${username}`,
      `https://${host}/users/${username}`,
    ],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page', //DevSkim: ignore DS137138
        type: 'text/html',
        href: `https://${host}/@${username}`,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${host}/users/${username}`,
      },
      {
        rel: 'http://ostatus.org/schema/1.0/subscribe', //DevSkim: ignore DS137138
        template: `https://${host}/authorize_interaction?uri={uri}`,
      },
    ],
  }
}

export function Akkoma(host: string, username: string): WebFinger {
  return {
    subject: `acct:${username}@${host}`,
    aliases: [`https://${host}/users/${username}`],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page', //DevSkim: ignore DS137138
        type: 'text/html',
        href: `https://${host}/users/${username}`,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${host}/users/${username}`,
      },
      {
        rel: 'http://ostatus.org/schema/1.0/subscribe', //DevSkim: ignore DS137138
        template: `https://${host}/ostatus_subscribe?acct={uri}`,
      },
    ],
  }
}

export const Plemora = Akkoma

export function Misskey(host: string, username: string): WebFinger {
  return {
    subject: `acct:${username}@${host}`,
    aliases: [`https://${host}/users/${username}`],
    links: [
      {
        rel: 'http://webfinger.net/rel/profile-page', //DevSkim: ignore DS137138
        type: 'text/html',
        href: `https://${host}/@${username}`,
      },
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://${host}/@${username}`,
      },
      {
        rel: 'http://ostatus.org/schema/1.0/subscribe', //DevSkim: ignore DS137138
        template: `https://${host}/authorize-follow?acct={uri}`,
      },
    ],
  }
}

function HandleAccount(account: Account, type: HostInfo) {
  switch (type) {
    case 'mastodon':
      return Mastodon(account.host, account.user)
    case 'akkoma':
      return Akkoma(account.host, account.user)
    case 'plemora':
      return Plemora(account.host, account.user)
    case 'misskey':
      return Misskey(account.host, account.user)
    default:
      throw new Error(`Unknown host type: ${type}`)
  }
}

export default HandleAccount
