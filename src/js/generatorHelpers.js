export function* mapGenerator(generator, f) {
  while (true) {
    const { done, value } = generator.next();
    if (done) {
      return;
    }
    yield f(value);
  }
}

export function* filterGenerator(generator, predicate) {
  while (true) {
    const { done, value } = generator.next();
    if (done) {
      return;
    }
    if (predicate(value)) {
      yield value;
    }
  }
}
