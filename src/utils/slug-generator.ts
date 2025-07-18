export function slugGenerator(title: string) {
  const slug = title.toLowerCase().replace(/ /g, '-');
  return slug;
}
