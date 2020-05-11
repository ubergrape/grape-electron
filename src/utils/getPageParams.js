import qs from 'querystring'

export default url => qs.parse(new URL(url).search.substr(1))
