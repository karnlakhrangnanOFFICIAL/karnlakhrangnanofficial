import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      'assets/js/vendor/**/*',
      'assets/js/app.bundle.min.js',
      'data/**/*',
    ],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
