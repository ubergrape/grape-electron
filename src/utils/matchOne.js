import minimatch from 'minimatch'

export default (url, globs) => globs.some(glob => minimatch(url, glob))
