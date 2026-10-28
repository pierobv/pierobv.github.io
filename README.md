# pierobv.github.io

My personal site: [pierobv.github.io](https://pierobv.github.io).

React + TypeScript, built with Vite, no UI libraries. English by default with a Portuguese
option, light and dark themes, and projects listed from [`src/data/projects.ts`](src/data/projects.ts).

```bash
npm install
npm run dev      # local server
npm run build    # type check + production build in dist/
```

Every push to `main` is built and published by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
