import { defineConfig } from 'orval';

export default defineConfig({
  boards: {
    output: {
      mode: 'tags-split',
      target: 'src/app/api/generated/boards.ts',
      schemas: 'src/app/api/generated/model',
      client: 'angular',
      clean: true,
      override: {
        angular: {
          retrievalClient: 'httpClient',
        },
      },
    },
    input: {
      target: 'http://localhost:8080/v3/api-docs',
    },
  },
});
