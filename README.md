# quick-res
> 🚀 A set of small utilities that makes Response. q.json(), q.text(), q.html(), .... can make your code shorter and more readable while also providing good support for Tree-Shaking.

```
npm install quick-res
```

- Works fine with any kinds of worker that supports Web Standard API.
- Supports both CommonJS and ESM.
- Small! Only 883 bytes (ESM). See [screenshot](#screenshot).

### Usage

Cloudflare workers example:

```ts
import * as quick from 'quick-res';

export default {
  async fetch(req: Request): Promise<Response> {
    const u = new URL(req.url);

    if (u.pathname === '/check') {
      const version = u.searchParams.get('version');
      if (!version) {
        return quick.text('Invalid', 400);
      }
      return quick.json({ version });
    }

    return quick.notFound();
  },
};

```

### Tree-Shaking

[Tree-Shaking](https://webpack.js.org/guides/tree-shaking/) is enabled by default. Your bundler should only include functions that you use.


### API

#### text(string, status?, headers?)
#### text(string, responseInit?)
Responds as text/plain.

#### html(string, status?, headers?)
#### html(string, responseInit?)
Responds as text/html.

#### json(object, status?, headers?)
#### json(object, responseInit?)
Responds as application/json.
`object` will be automatically converted to JSON using `JSON.stringify`.

#### resp(bodyInit, status?, headers?)
#### resp(bodyInit, responseInit?)

Responds stream or whatever you want.

#### notFound()
404.

#### redirect
Not included. Use `Response.redirect` instead.


### Create your own utilities

```ts
import * as quick from 'quick-res';

export function forbidden() {
  return quick.text('Forbidden', 403);
}

export function badRequest(info: unknown) {
  return quick.json(info, 400);
}

export function internalError(error: Error) {
  return quick.text(error.message, 500);
}

```


### Screenshot

Only 883 bytes (ESM)

<img src="https://github.com/ReeganExE/quick-res/blob/main/code.webp?raw=true" alt="small code">

# LICENSE
New BSD License ©Ninh Pham - ReeganExE
