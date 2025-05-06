![Corner Inverter Logo](./public/icon.svg)

# Corner Inverter

A tool to help you generate inverted border radii for you CSS components, powered by SVG path. [try it here!](https://corner-inverter.douiri.org).

![Screenshot](./public/screenshot.png)

## Why do we need this tool

The difficulty of creating such shapes in CSS is the inspiration behind this tool. in contrast to border-radius property, inverted corners need some tricks to work properly which can be time consuming, that's why this tool aims to save you time calculating and getting burned out trying to do it.

So, what creative shapes you can make with it?

## How does it work

You can choose which corners to be inverted along with other properties, after finishing you can export your shape as CSS mask, clip-path or SVG.

## CSS Limitations

- for CSS clip-path the result is not responsive and the shape must be at the exact dimensions, this is because the `path()` function does't accept percentage values.
- With the `mask` property it will work fine as long as the aspect ratio of your element matches the aspect ratio specified in the tool. to make sure your element's aspect ratio stays the same in CSS use the `aspect-ratio` property.
