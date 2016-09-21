const root = `file://${__dirname}`
const local = `${root}/dist/pages/index.html`

export const urls = {
  domain: `${local}?page=domain`,
  loading: `${local}?page=loading`,
  lostConnection: `${local}?page=lostConnection`
}
