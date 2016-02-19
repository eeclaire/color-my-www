# color-my-www
Implements Clarifai API to color website elements based on an image

## How to
Create an account at developer.clarifai.com. 

Create an application and copy and paste your application CLIENT_ID and CLIENT_SECRET into a `keys.js` file as shown below. (Don't forget to include it in your `.gitignore` file so that you don't share your credentials with everyone!)

```
var CLIENT_ID = 'your ID here';
var CLIENT_SECRET = 'your secret here';
```

Include clarifai.js in your project source. 

In your index.html, create an array of the elements whose color you want dependent on image uploaded. Pass the image url and the element array to the `requestColor` function and call it.

I created `index.html` as a usage example if you want to check that out!

## Sources
I definitely stole the clarifai javascript started from https://github.com/cassidoo/clarifai-javascript-starter. Check it out, it's p cool.
