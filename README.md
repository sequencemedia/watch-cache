# @sequencemedia/watch-cache

Generates a read-only description of a file system directory path as a `Set`

From the command line

```shell
npm start -- --path '~/Documents'
```

Or with the default export

```javascript
import watchCache from '@sequencemedia/watch-cache'

const path = '~/Documents'

watchCache(path)
```

You can confirm whether a file path exists in that directory with `has`

```javascript
import { has } from '@sequencemedia/watch-cache'
```

Or get a _duplicate_ of the current `Set` with `getCache`

```javascript
import { getCache } from '@sequencemedia/watch-cache'
```
