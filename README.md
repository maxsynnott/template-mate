# template-mate

A simple tool to help you create and render templates.

## Install

```shell
npm install --save template-mate
```

```
yarn add template-mate
```

## Usage

### API

```js
import { renderFile } from 'template-mate'

const variables = {
	foo: 'bar',
}

renderFile({
	templateFile: 'README.template.md',
	outFile: 'README.md',
	variables,
})
```
