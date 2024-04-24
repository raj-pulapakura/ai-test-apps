const { UNSPLASH_ACCESS_KEY } = process.env;

export const getImages = async ({
  query,
  per_page,
}: {
  query: string;
  per_page: number;
}): Promise<string[]> => {
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${per_page}&page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
  const response = await fetch(url);
  const json = await response.json();
  return json.results.map((result: any) => result.urls.small);
};
