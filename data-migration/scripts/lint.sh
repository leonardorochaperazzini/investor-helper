#!/bin/sh
npx eslint . --ext .ts --parser-options '{"project": "./tsconfig.json"}' --resolve-plugins-relative-to . --no-eslintrc
