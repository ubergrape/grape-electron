import minimatch from 'minimatch'

export default (globs, url) => globs.some(glob => minimatch(url, glob))
