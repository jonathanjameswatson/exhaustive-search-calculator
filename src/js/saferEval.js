export default (returnExpressionString, variablesString = "") =>
  // eslint-disable-next-line no-new-func
  Function(
    `"use strict";${variablesString}return (${returnExpressionString})`
  )();
