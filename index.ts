interface CreateResponse<T = unknown> {
  (data: T | null, /** Status code. Defaults to 200. */ status?: number, headers?: HeadersInit): Response;
  (data: T | null, init?: ResponseInit): Response;
}

type JSONResp = CreateResponse<unknown>;

interface Params {
  contentType$?: string;
  status$?: number;
  transfrom$?(u: unknown): unknown;
}

function constructResp<T extends BodyInit>({ contentType$: contentType, transfrom$: transfrom, status$ }: Params = {}) {
  return function (data: T | null, arg?: number | ResponseInit, headers?: HeadersInit): Response {
    if (transfrom && data) {
      data = transfrom(data) as T;
    }

    // Return Response immediately if arg is RequestInit.
    if (arg && typeof arg !== 'number') {
      const res = new Response(data, arg);
      return res;
    }

    const status = status$ ?? arg ?? 200;

    const preparedHeaders = new Headers();

    if (headers) {
      for (const [k, v] of headers instanceof Headers ? headers.entries() : Object.entries(headers as HeadersInit)) {
        if (typeof v === 'string') {
          preparedHeaders.set(k, v);
        } else {
          for (const v2 of v) {
            preparedHeaders.append(k, v2);
          }
        }
      }
    }
    if (contentType) {
      preparedHeaders.set('content-type', contentType);
    }

    return new Response(data, {
      status,
      headers: preparedHeaders,
    });
  };
}
/**
 * Responds stream or whatever you want.
 */
export const resp: CreateResponse<BodyInit> = /* @__PURE__ */ constructResp();

/**
 * Responds as text/plain.
 */
export const text: CreateResponse<string> = /* @__PURE__ */ constructResp({
  contentType$: 'text/plain; charset=UTF-8',
});

/**
 * Responds as application/json.
 * The data is converted into a JSON string using JSON.stringify.
 */
export const json: JSONResp = /* @__PURE__ */ constructResp({
  contentType$: 'application/json; charset=UTF-8',
  transfrom$: JSON.stringify,
}) as JSONResp;

/**
 * Responds as text/html.
 */
export const html: CreateResponse<string> = /* @__PURE__ */ constructResp({ contentType$: 'text/html; charset=UTF-8' });

export const notFound = (): Response => /* @__PURE__ */ new Response('Not found', { status: 404 });
