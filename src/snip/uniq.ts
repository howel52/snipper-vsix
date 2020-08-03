function uniq<T>(list: Array<T>): Array<T> {
  return Array.from(new Set(list));
}