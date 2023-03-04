// const isLocalhost =
//   globalThis.location.hostname === 'localhost' ||
//   globalThis.location.hostname === '127.0.0.1'
interface FetchParams {
  path?: string
  method?: string
  params?: any
}
type RequestParams = Parameters<typeof fetch>[1]
// export function fetchApi<T extends any>(fetcher: () => Promise<any>): Promise<T>
// export function fetchApi<T extends any>(fetchParams: FetchParams, equalKey?: string): Promise<T>;
export const fetchApi = (fetchParams: FetchParams) => {
  let { path, method, params } = fetchParams
  let fetcher: Promise<any>
  const bodyParams = params ?? {}
  method = method ?? 'GET'
  const requestParams: RequestParams = {
    body: JSON.stringify(bodyParams),
    method: method,
  }
  if (method === 'GET') delete requestParams.body
  if (method === 'POST')
    //TODO
    // fetcher = fetch(isLocalhost ? `/api/${path}` : process.env.NEXT_BACKEND_URL,{
    fetcher = fetch(`/api/${path}`, {
      ...requestParams,
      headers: { 'content-Type': 'application/json' },
    }).then((response) => response.json())
}
