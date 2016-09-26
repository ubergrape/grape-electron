const root = `file://${process.cwd()}/build`
const pages = `${root}/lib/pages/index.html`
export const urls = {
  domain: `${pages}?page=domain`,
  loading: `${pages}?page=loading`,
  lostConnection: `${pages}?page=lostConnection`
}
