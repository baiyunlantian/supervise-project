module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es.promise',
        'es.symbol'
      ],
      useBuiltIns: "entry"
    }]
  ],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
}
