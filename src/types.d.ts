interface Bindings {
  ACCOUNTS: KVNamespace
  HOST_INFO: KVNamespace
}

interface Account {
  user: string
  host: string
}

type HostInfo = 'misskey' | 'akkoma' | 'plemora' | 'mastodon'

interface WebFinger {
  subject: string
  aliases: string[]
  links: WebFingerLink[]
}

type WebFingerLink = WebFingerLinkHref | WebFingerLinkTemplate

interface WebFingerLinkHref {
  rel: string
  type: string
  href: string
}

interface WebFingerLinkTemplate {
  rel: string
  template: string
}
