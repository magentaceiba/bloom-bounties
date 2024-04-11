async function apiResponse<T>(
  call: () => Promise<T>,
  successStatus = 200,
  errorStatus = 500
) {
  try {
    const result = await call()
    return Response.json(result, { status: successStatus })
  } catch (err: any) {
    return new Response(
      err?.message || 'Unexpected: Could not retrieve any error messages',
      {
        status: err?.statusCode ?? errorStatus,
      }
    )
  }
}

async function pageData<T>(action: () => Promise<T>) {
  try {
    const data = await action()
    return { data, error: null }
  } catch (err: any) {
    return {
      data: null,
      error:
        (err?.message as string | undefined) ??
        'An Unknown Error Has Happened :(',
    }
  }
}

const main = {
  apiResponse,
  pageData,
}

export default main
