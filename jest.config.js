module.exports = {
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    
    // The test environment that will be used for testing
    testEnvironment: 'node',
  
    // A map from regular expressions to paths to transformers
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // If you're using Babel for transpiling JavaScript files
    },
  
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  
    // The glob patterns Jest uses to detect test files
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  
    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ['node_modules'],
  
    // Mocking specific modules or files
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Example for aliasing @/ to src/ directory
    },
  };