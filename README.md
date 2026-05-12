This plugin will allow the user to select an amination to apply to a block from a dropdown in the block inspector. Use code in the css files in the animista folder in src, start with the basic slide in animations to get it working then ill add the others later:
-slide-top
-slide-bl
-slide-bottom
-slide-br

The animation should trigger when the block enters the viewport and should only trigger once per page load.

By default it should apply to all css properties and default to 5000ms linear ease, but the user should be able to customize the duration, easing, and which properties the animation applies to (ex: transform only, opacity only, etc.).

Start with the defaults and we'll add the customization once it's working. 

Use ts and scss for src files and vite to build. 