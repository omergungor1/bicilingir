const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifySelectors: true,
          reduceIdents: false,
        }]
      }
    } : {})
  },
};

export default config;
