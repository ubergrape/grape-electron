module.exports = api => {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/react']
  const plugins = [
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
    'transform-decorators-legacy',
    [
      'react-intl',
      {
        messagesDir: './i18n',
      },
    ],
  ]

  return { presets, plugins }
}
