============= commit messages ==========

feat: add hat wobble
^--^ ^------------^
| |
| +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
More Examples:

feat: (new feature for the user, not a new feature for build script)
fix: (bug fix for the user, not a fix to a build script)
docs: (changes to the documentation)
style: (formatting, missing semi colons, etc; no production code change)
refactor: (refactoring production code, eg. renaming a variable)
test: (adding missing tests, refactoring tests; no production code change)
chore: (updating grunt tasks etc; no production code change)

=========================================

- styles (theme & styles)
- layouts (layout components)
- compontents (non-layout components used across pages)
- views (page specific components & hooks)
- pages
  - api (node.js service handlers backend)
- lib-client (decoupled front-end logic)
  - controllers (query & mutations)
  - stores (front-end state management)
  - hooks (custom hooks)
  - constants
- lib-server (decoupled back-end logic)
  - api-controllers
  - constants
- prisma
- utils (small helper functions)
