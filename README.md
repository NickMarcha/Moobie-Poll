# Moobie-Poll

Make polls quickly from [TMDB](https://www.themoviedb.org/)(The Movie Database)
hosted statically with Github Pages [here](https://NickMarcha.github.io/Moobie-Poll). Use the inbuilt [StrawPoll](https://strawpoll.com/) api or copy paste line-by-line entries and use as you see fit.

Also pulls data from youtube links if desired.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

Push the React app to the GitHub repository

```shell
$ npm run deploy
```

That will cause the `predeploy` and `deploy` scripts defined in `package.json` to run.

Under the hood, the `predeploy` script will build a distributable version of the React app and store it in a folder named `build`. Then, the `deploy` script will push the contents of that folder to a new commit on the `gh-pages` branch of the GitHub repository, creating that branch if it doesn't already exist.

By default, the new commit on the `gh-pages` branch will have a commit message of "Updates". You can [specify a custom commit message](https://github.com/gitname/react-gh-pages/issues/80#issuecomment-1042449820) via the `-m` option, like this:

```shell
$ npm run deploy -- -m "Deploy React app to GitHub Pages"
```

[React Git Pages Info](https://github.com/gitname/react-gh-pages)
