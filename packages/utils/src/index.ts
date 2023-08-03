type AuthorFilterLiteral = `author:${string}`
type TitleFilterLiteral = `title:${string}`
interface Filter { type: 'author' | 'title'; regexp: RegExp }

const AUTHOR_REGEX = /^author:(\S+)$/
const TITLE_REGEX = /^title:(\S+)$/

export function isAuthorFilter(filter: string): filter is AuthorFilterLiteral {
  return !!filter.match(AUTHOR_REGEX)
}

export function isTitleFilter(filter: string): filter is TitleFilterLiteral {
  return !!filter.match(TITLE_REGEX)
}

export function getTypedFilter(filter: string): Filter {
  if (filter.includes(':')) {
    if (isAuthorFilter(filter)) {
      const regexp = new RegExp(filter.match(AUTHOR_REGEX)![1]!)
      return { type: 'author', regexp }
    }
    else {
      return getTypedFilter(filter.match(TITLE_REGEX)![1]!)
    }
  }
  return {
    type: 'title',
    regexp: new RegExp(filter),
  }
}
