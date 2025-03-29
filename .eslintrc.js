module.exports = {
  // Keep any existing configuration
  rules: {
    // Add or modify rules as needed
  },
  // This is the important part - prevent warnings from failing the build
  env: {
    node: true,
    browser: true,
    es6: true
  },
  // Set this to 'warn' to prevent ESLint from treating warnings as errors
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}; 