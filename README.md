A terrible parser for kots lint rego files, only outputs Markdown at the moment.

Opa must be installed to run (`brew install opa`).

```
cd replicatedhq/kots-lint
opa parse pkg/kots/rego/kots-spec-opa-nonrendered.rego -f json | npx kots-lint-docgen
```