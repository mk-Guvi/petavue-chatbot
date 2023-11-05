import axios, { AxiosResponse } from 'axios';

export async function backendPost(url: string, body: Record<string, any>): Promise<AxiosResponse> {
  try {
    const formData = new FormData();

    // Convert the body object to form data
    for (const key in body) {
      formData.append(key, body[key]);
    }

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    // Handle any errors here, you can log or throw an exception
    throw error;
  }
}


