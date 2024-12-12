# chatbot-client-ts

chatbot-client-ts is a typescript project using chatbot to display chatbot in an internet page.

---

# Install

[ to do]

# To Contribute to chatbot-client-ts

## Requirements

-   docker
-   git

## Install

```console
git clone git@gitlab.logipro.com:alban/chatbot-client-ts.git
./install
```

## Build

### Transpile

```console
bin/tsc
```

## Unit Test

Test source files with TypeScript Jest:

```console
bin/npm run test
```

## Quality

Code requirements:

-   codecheck: `eslint:recommended` & `typescript-eslint:recommended`
-   coverage: ~ 100% as a consequence of Test Developpement Driven practice

Check code with ESLint:

```console
bin/npm run codecheck
```

Check format with Prettier:

```console
bin/npm run prettier
```

Check infection with Stryker Mutator:

```console
bin/npm run test:mutate
```
