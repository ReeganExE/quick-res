import * as assert from 'node:assert';
import { Readable } from 'node:stream';

import test from 'node:test';

import * as quick from './index.ts';

test('json', async () => {
  const res = quick.json({ dep: 'trai' });
  assert.equal(res.headers.get('content-type')?.startsWith('application/json'), true);
  assert.equal('{"dep":"trai"}', await res.text());
});

test('text', async () => {
  const res = quick.text('Invalid', 400);
  assert.equal(res.headers.get('content-type')?.startsWith('text/plain'), true);
  assert.equal('Invalid', await res.text());
  assert.equal(400, res.status);
});

test('stream', async () => {
  const stream = Readable.toWeb(Readable.from(['text stream']));
  const res = quick.resp(stream as ReadableStream);
  assert.ok(res.body);
  const reader = res.body.getReader();
  async function push() {
    const rs = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return rs.join('');
      }
      rs.push(value);
    }
  }
  const data = await push();

  assert.equal('text stream', data);
});
