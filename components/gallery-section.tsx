"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Users, ImageIcon, X } from "lucide-react"

interface Photo {
  id: string
  url: string
  thumbnail: string
  title: string
  date: string
  event: string
  description?: string
}

interface PhotoAlbum {
  id: string
  title: string
  date: string
  coverPhoto: string
  photoCount: number
  photos: Photo[]
}

export function GallerySection() {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      setLoading(true)
      // This will call your Laravel API endpoint
      const response = await fetch("/api/gallery/albums")
      if (!response.ok) {
        throw new Error("Failed to fetch albums")
      }
      const data = await response.json()
      setAlbums(data.albums || [])
    } catch (err) {
      setError("Unable to load photo albums. Please try again later.")
      // Fallback to mock data for demonstration
      setAlbums(mockAlbums)
    } finally {
      setLoading(false)
    }
  }

  const fetchAlbumPhotos = async (albumId: string) => {
    try {
      const response = await fetch(`/api/gallery/albums/${albumId}/photos`)
      if (!response.ok) {
        throw new Error("Failed to fetch photos")
      }
      const data = await response.json()
      return data.photos || []
    } catch (err) {
      console.error("Error fetching album photos:", err)
      return mockAlbums.find((album) => album.id === albumId)?.photos || []
    }
  }

  const handleAlbumClick = async (album: PhotoAlbum) => {
    const photos = await fetchAlbumPhotos(album.id)
    setSelectedAlbum({ ...album, photos })
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Photo Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Photo Gallery</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchAlbums} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>
        <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground">
          {albums.length} Albums
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <Card
            key={album.id}
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
            onClick={() => handleAlbumClick(album)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={album.coverPhoto || "/placeholder.svg"}
                alt={album.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-semibold text-white text-balance">{album.title}</h3>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {album.date}
                </div>
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  {album.photoCount} photos
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Album Photos Dialog */}
      <Dialog open={!!selectedAlbum} onOpenChange={() => setSelectedAlbum(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {selectedAlbum?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
            {selectedAlbum?.photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.thumbnail || "/placeholder.svg"}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Photo Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedPhoto?.title}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain bg-muted"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {selectedPhoto.date}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {selectedPhoto.event}
                </div>
              </div>
              {selectedPhoto.description && (
                <p className="text-sm text-muted-foreground">{selectedPhoto.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Mock data for demonstration
const mockAlbums: PhotoAlbum[] = [
  {
    id: "1",
    title: "Spring Festival 2024",
    date: "March 15, 2024",
    coverPhoto: "/children-spring-festival-waldorf-school.jpg",
    photoCount: 24,
    photos: [
      {
        id: "1-1",
        url: "/waldorf-school-spring-festival-children-dancing.jpg",
        thumbnail: "/waldorf-school-spring-festival-children-dancing.jpg",
        title: "Spring Dance Performance",
        date: "March 15, 2024",
        event: "Spring Festival",
        description: "Children performing traditional spring dances",
      },
      {
        id: "1-2",
        url: "/waldorf-school-spring-festival-maypole.jpg",
        thumbnail: "/waldorf-school-spring-festival-maypole.jpg",
        title: "Maypole Celebration",
        date: "March 15, 2024",
        event: "Spring Festival",
        description: "Traditional maypole dancing celebration",
      },
    ],
  },
  {
    id: "2",
    title: "Harvest Celebration",
    date: "October 8, 2024",
    coverPhoto: "/waldorf-school-harvest-festival-autumn.jpg",
    photoCount: 18,
    photos: [
      {
        id: "2-1",
        url: "/waldorf-school-harvest-festival-pumpkins.jpg",
        thumbnail: "/waldorf-school-harvest-festival-pumpkins.jpg",
        title: "Pumpkin Display",
        date: "October 8, 2024",
        event: "Harvest Celebration",
        description: "Beautiful harvest display created by students",
      },
    ],
  },
  {
    id: "3",
    title: "Winter Concert",
    date: "December 12, 2024",
    coverPhoto: "/waldorf-school-winter-concert-children-singing.jpg",
    photoCount: 32,
    photos: [
      {
        id: "3-1",
        url: "/waldorf-school-winter-concert-choir.jpg",
        thumbnail: "/waldorf-school-winter-concert-choir.jpg",
        title: "School Choir Performance",
        date: "December 12, 2024",
        event: "Winter Concert",
        description: "Annual winter concert featuring all grade levels",
      },
    ],
  },
]
