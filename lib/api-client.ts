interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = process.env.LARAVEL_API_URL || "http://localhost:8000/api"
    this.token = process.env.LARAVEL_API_TOKEN || ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
          ...options.headers,
        },
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.message || "An error occurred",
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      }
    }
  }

  // Gallery API methods
  async getAlbums() {
    return this.request("/gallery/albums")
  }

  async getAlbumPhotos(albumId: string) {
    return this.request(`/gallery/albums/${albumId}/photos`)
  }

  // Calendar API methods
  async getEvents(year: number, month: number) {
    return this.request(`/calendar/events?year=${year}&month=${month}`)
  }

  // Downloads API methods
  async getDownloadCategories() {
    return this.request("/downloads/categories")
  }

  async getDownloadFiles() {
    return this.request("/downloads/files")
  }

  async trackDownload(fileId: string) {
    return this.request(`/downloads/files/${fileId}/download`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
