const root = `file://${__dirname}`
const local = `${root}/dist/local/index.html`

export const urls = {
  test: `${root}/spec.html`,
  domain: `${local}?page=domain`,
  loading: `${local}?page=loading`,
  lostConnection: `${local}?page=lostConnection`
}
