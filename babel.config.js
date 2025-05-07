// module.exports = function (api) {
//   api.cache(true);
//   const plugins = [
//     [
//       'module-resolver',
//       {
//         extensions: ['.js', '.jsx', '.ts', '.tsx'],
//         alias: {
//           '@components': './components',
//           '@assets': './assets',
//         },
//       },
//     ],
//   ];

//   return {
//     presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

//     plugins,
//   };
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
