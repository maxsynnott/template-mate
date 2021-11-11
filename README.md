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

### CLI

The cli will assume your variables are at `template-mate.json`

```shell
template-mate render --templateFile README.template.md --outFile README.md
```

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
