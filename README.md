# esay-babel
Easy use of babel to parse your project/modules

## Install

```
$ npm install -g easy-babel
```

## Usage

## Parse your module before relase

Run the following command under your module, `my_module` for example,

```
$ easy release [targets...] -v [version]
```

You'll have a directory `.easy` for parsed files, and a new|modified `package.json` which refers `main` to `.easy`

Then `import my_module from "my_module"` will import the parsed files as expected

## Parse your dependencies

```
$ easy depends [targets...] -v [version]
```

This command will parse your dependencies which needs higher node version with `$ easy relase`

## Execute

Since your parsed code is under directory `.easy`, you can run directly by

```
$ node .easy/**/*.js
```

or use `easy-node`: _not implemented_

```
$ alias node=easy-node
$ node **/*.js
```
