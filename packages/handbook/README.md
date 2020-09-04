# Synchronous Health Talent Handbook

This repository contains our talent (employee) handbook.  

We love open source and so have open sourced this handbook.

We use [bestatic](https://github/bestyled/bestatic) to generate the handbook.   We use a modified version of markdown (with React extensions) and React 16.8 (the one with hooks), but the generated files are completely static and have no runtime.

## Demo

The site is live at [talent.sync.health](https://talent.sync.health)

## Editing the handbook

All the source files are in the `pages` directory.   Just edit in any plain text editor, markdown processor, or Visual Studio Code with the `tdx` or `mdx-js` extension.

## Changing the layout

The easiest changes are made by editing the theme file.   More advanced changes can be made by using different `layout` definitions in the index.mdx files (specified as the default export); in particular, replace the following lines with your own implementation:

``` javascript
export { DocsLayout as Root } from  '@bestatic/layout'
```

## Installing the handbook

``` bash
yarn
```

Edit the `/config/bestatic.config.js` with your company and site details;  add any referenced logos to the `public` folder;  adjust the `/config/theme` file

Edit the `firebase.json` or swap out for your favorite static hosting site (or just use github pages).

## Credentials for the search index

Create a `config/env.config.json` file with your algolia admin (write and search) credentials
```json
{
    "BERUN_ALGOLIA_APIADMIN" : "YOUR_ADMIN_API_KEY_FOR_WRITES"
    "BERUN_ALGOLIA_APPID" : "YOUR_APP_ID"
    "BERUN_ALGOLIA_APIKEY" : "YOUR_API_KEY_FOR_SEARCH_ONLY"
    "BERUN_ALGOLIA_INDEX" : "talent"
}
```

## Generating the handbook and search index

```bash
yarn build
firebase deploy
```

All the generated files will be in the `build-static` folder;  the build command will actually upload the docsearch index to Algolia.

It is not necessary to register the site with docsearch or use docker as the index is generated directly by the [bestatic](https://github/bestyled/bestatic) build scripts; any Algolia plan should work.

### License

Creative Commons Attribution-ShareAlike 4.0 International