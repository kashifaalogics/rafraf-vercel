import { ApiFetcherOptions, ApiFetcherResults } from "@common/types/api";
import { GraphqlError, handleError } from "@common/utils/handlers";
import { API_URL } from "@framework/const";

const fetchApi = async <T>({
  query,
  variables,
  locale,
  token,
}: ApiFetcherOptions): Promise<ApiFetcherResults<T>> => {
  let headers: Record<string, string> = {
    "Content-Type": "application/json;UTF-8",
  };

  if (locale) {
    headers["Store"] = locale;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  // `slice(1)` to remove first char from magento
  // response because of a missing header leading
  // to read the res body incorrectly
  // ref: https://stackoverflow.com/a/48195550
  let data: T, errors: GraphqlError[];
  const text = await res.text();
  try {
    const parsed = JSON.parse(text);
    data = parsed.data;
    errors = parsed.errors;
  } catch (e) {
    console.log('ERROR 501')
    console.log(e)
    const parsed = JSON.parse(text.slice(1));
    data = parsed.data;
    errors = parsed.errors;
  }

  return { data };
};

export default fetchApi;
