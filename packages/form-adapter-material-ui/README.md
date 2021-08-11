# @strong-js/form-adapter-material-ui

[![Stable release](https://img.shields.io/npm/v/@strong-js/form-adapter-material-ui.svg)](https://npm.im/@strong-js/form-adapter-material-ui)

## Installation

You'll need to ensure you have the Roboto font available, to do this in one of two ways:

1. Modify your `apps/web/YOUR_APP/pages/_document.tsx` and add:

```
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
  />
```

See [https://github.com/mui-org/material-ui/tree/master/examples/nextjs] for more details.

OR

2. Add it using the `next/head` component, see [https://nextjs.org/docs/basic-features/font-optimization]

Shared utilities for various `@strong-js` packages.

**Important:** This package is intended for internal use by the @strong-js libraries. You should not use it directly in your production projects, as the APIs can and will change often without regard to sem-ver. You have been warned!
