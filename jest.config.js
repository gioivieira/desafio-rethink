export default {
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Relatório dos testes",
      outputPath: "./src/evidence/test-report.html",
      includeFailureMsg: true
    }]
  ]
}