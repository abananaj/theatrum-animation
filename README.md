This plugin will allow the user to select an amination to apply to a block from a dropdown in the block inspector. Use code in the css files in the animista folder in src, start with the basic slide in animations to get it working then ill add the others later:
-slide-top
-slide-bl
-slide-bottom
-slide-br

The animation should trigger when the block enters the viewport and should only trigger once per page load.

By default it should apply to all css properties and default to 5000ms linear ease, but the user should be able to customize the duration, easing, and which properties the animation applies to (ex: transform only, opacity only, etc.).

Start with the defaults and we'll add the customization once it's working.

Use ts and scss for src files and vite to build.

# Animation Category

## Basic ✨

### Flip

### Rotate

### Scale

### Shadow

### Slide

## Backgrounds 🖼️

- Background Pan
- Background Color Change
- Background Ken Burns

## Entrances 🚪➡️

- Rotate In
- Slide In
- Fade In
- Bounce In
- Flicker In
- Roll In
- Scale In
- Puff In
- Swing In
- Swirl In
- Tilt In

## Exits 🚪⬅️

- Rotate Out
- Scale Out
- Slide Out
- Bounce Out
- Fade Out
- Flicker Out
- Flip Out
- Puff Out
- Roll Out
- Slit Out
- Swing Out
- Swirl Out

## Text ⌨️

- Blur Out
- Focus In
- Text Flicker
- Text Pop
- Text Shadow Drop
- Text Shadow Pop
- Tracking In
- Tracking Out

## Attention ⚠️

- Blink
- Bounce
- Flicker
- Heartbeat
- Jello
- Ping
- Pulsate
- Scale Down
- Scale Up
- Shake
- Vibrate
- Wobble

# Block Editor Inspector Panel

## 1. Category Dropdown - Basic, Backgrounds, Entrances, Exits, Text, Attention

```js
<SelectControl __next40pxDefaultSize label="Label" onChange="{()" ="">
	{}} >
	<React.Fragment key=".0">
		<option value="entrance">Entrance</option>
		<option value="exit">Exit</option>
		<option value="background">Background</option>
		<option value="text">Text</option>
		<option disabled value="attention">Attention</option>
		<option disabled value="basic">Basic</option>
	</React.Fragment>
</SelectControl>
```
## 2. Animation Dropdown
Populated based on category selection, see bulleted lists above under each category
Example for entrance category:
```js
<SelectControl __next40pxDefaultSize label="Label" onChange="{()" ="">
	{}} >
	<React.Fragment key=".0">
		<option value="rotate-in">Rotate</option>
		<option value="slide-in">Slide</option>
		<option value="fade-in">Fade</option>
		<option value="scale-in">Scale</option>
		<option disabled value="roll-in">Roll</option>
		<option disabled value="twirl-in">Twirl</option>
		<option disabled value="swirl-in">Swirl</option>
		<option disabled value="swing-in">Swing</option>
		<option disabled value="twirl-in">Twirl</option>
		<option disabled value="puff-in">Puff</option>
		<option disabled value="flicker-in">Flicker</option>
		<option disabled value="tilt-in">Bounce</option>
	</React.Fragment>
</SelectControl>
```
## 3. Direction Dropdown (only shows if the selected animation has directional options, Ex. if user selects "Slide In" in animation dropdown):
[Select with Prefix](https://wordpress.github.io/gutenberg/?path=/story/components-selectcontrol--with-prefix)

```js
<SelectControl
  __next40pxDefaultSize
  label="Label"
  onChange={() => {}}
  options={[
    {
      label: 'Top Left',
      value: 'tl'
    },
    {
      label: 'Top',
      value: 'top'
    },
    {
      label: 'Top Right',
      value: 'tr'
    },
    {
      label: 'Right',
      value: 'right'
    },
    {
      label: 'Bottom Right',
      value: 'br'
    },
    {
      label: 'Bottom',
      value: 'bottom'
    },
    {
      label: 'Bottom Left',
      value: 'bl'
    },
    {
      label: 'Left',
      value: 'left'
    },
    {
      label: '—',
      value: null
    }
  ]}
  prefix={<InputControlPrefixWrapper>[animation from step 2]</InputControlPrefixWrapper>}
/>
```
## 4. Duration Input - Number input for duration in ms (default: 500ms)
## 5. Easing Dropdown - Two part dropdown (https://greensock.com/docs/v3/Eases) [Power 1-4, Back].[in,out,inOut]
[With Hints](https://wordpress.github.io/gutenberg/iframe.html?id=components-customselectcontrol--docs&viewMode=docs&globals=#with-hints)
```js
<CustomSelectControl
  __next40pxDefaultSize
  label="Easing Function"
  onChange={() => {}}
  options={[
    {
      hint: 'power1',
      key: 'power1',
      name: 'power1'
    },
    {
      hint: 'power2',
      key: 'power2',
      name: 'power2'
    },
    {
      hint: 'power3',
      key: 'power3',
      name: 'power3'
    },
    {
      hint: 'power4',
      key: 'power4',
      name: 'power4'
    },
    {
      hint: 'back',
      key: 'back',
      name: 'back'
    }
  ]}
  value={{
    hint: 'power1',
    key: 'power1',
    name: 'power1'
  }}
/>
```
```js
<CustomSelectControl
  __next40pxDefaultSize
  label="Easing Function"
  onChange={() => {}}
  options={[
    {
      hint: 'in',
      key: 'in',
      name: 'in'
    },
    {
      hint: 'out',
      key: 'out',
      name: 'out'
    },
    {
      hint: 'inOut',
      key: 'inOut',
      name: 'inOut'
    }
  ]}
  value={{
    hint: 'out',
    key: 'out',
    name: 'out'
  }}
/>
```
## 6. Delay Input - Number input for delay in ms (default: 500ms)


## To Do 📋
- [ ] seperate delay, number input
- [ ] separate duration, number input
- [x] add option for animation easing (ex: power1, power2, back, etc.)
- [ ] add option for animation easing direction (ex: in, out, inOut)
- [ ] add option for animation direction (ex: top, bottom, left, right, etc.) that only shows for animations that have directional options (ex: slide in, slide out, etc.)
- [ ] add option for animation category (ex: entrance, exit, background, text, attention, basic)
- [ ] add option for custom cubic_bezier easing function
- [ ] add option for animation trigger (ex: on scroll, on click, etc.)
- [ ] add option for repeat/loop and number of times to loop (ex: 3, infinite, etc.)
- [ ] add option for which css properties the animation applies to (ex: transform only, opacity only, etc.)
## Ideas 💡
eventually add ability to save combinations of these settings to the theme???!?!?!