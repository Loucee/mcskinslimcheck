# Minecraft skin type checker
A simple JS script to check if a Minecraft skin is slim or default

## Installation
Include mcskin-slimcheck.js in your website

```html
<script type="text/javascript" src="js/mcskin-slimcheck.js"></script>
```

## Usage and demo
After including the script you can easily check if a skin is slim or not like so:

```js
checkSkinType("path/to/skin.png", function(isSlim) {
  // If the skin is slim, isSlim will be true :)
  alert(`Skin is ${isSlim ? "" : " NOT"} slim`);
});
```

## License
MIT
