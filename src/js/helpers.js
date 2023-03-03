/** The goal of this file is to contain
 *  functions that we'll reuse over and over on
 *  our app.
 */
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Whatever response comes first, wins
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    // Data to json (also an async function, so we await for finishing)
    const data = await res.json();

    // If response is not ok, throw error so catch() can catch it
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    /**
     * We re-throw the error to be able to handle it
     * inside model.js and not here in helpers.js
     */
    throw err;
  }
};
