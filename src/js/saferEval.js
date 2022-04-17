export default (input) =>
  // eslint-disable-next-line no-new-func
  Function(`"use strict";return (${input})`)();
