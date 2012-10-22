# Build

## Run the build

To build open terminal and type:

	./js build/build.js

or command for windows:

	js build/buid.js

It will produce a `production.js` and `production.css` in `lib/build` folder.

## Switching to production

Then switch your application to production by editing `index.html` and adding `,production` to the
end of the `<script src="lib/steal/steal.js?app.js"></script>` script's source.

Now move `production.css` and `production.js` into the root of the app and open `index.html`.