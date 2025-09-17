"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Search,
  Filter,
  Calendar,
  Eye,
  FolderOpen,
} from "lucide-react"

interface DownloadFile {
  id: string
  name: string
  description?: string
  type: "pdf" | "image" | "video" | "audio" | "document" | "archive" | "other"
  size: string
  uploadDate: string
  category: "handbook" | "forms" | "newsletters" | "photos" | "videos" | "resources" | "other"
  url: string
  previewUrl?: string
  downloadCount?: number
}

interface FileCategory {
  id: string
  name: string
  description: string
  fileCount: number
}

export function DownloadsSection() {
  const [files, setFiles] = useState<DownloadFile[]>([])
  const [categories, setCategories] = useState<FileCategory[]>([])
  const [filteredFiles, setFilteredFiles] = useState<DownloadFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  useEffect(() => {
    fetchFiles()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterFiles()
  }, [files, searchTerm, selectedCategory, selectedType])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/downloads/files")
      if (!response.ok) {
        throw new Error("Failed to fetch files")
      }
      const data = await response.json()
      setFiles(data.files || [])
    } catch (err) {
      setError("Unable to load download files. Please try again later.")
      // Fallback to mock data
      setFiles(mockFiles)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/downloads/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      // Fallback to mock data
      setCategories(mockCategories)
    }
  }

  const filterFiles = () => {
    let filtered = files

    if (searchTerm) {
      filtered = filtered.filter(
        (file) =>
          file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((file) => file.category === selectedCategory)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((file) => file.type === selectedType)
    }

    setFilteredFiles(filtered)
  }

  const handleDownload = async (file: DownloadFile) => {
    try {
      const response = await fetch(`/api/downloads/files/${file.id}/download`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Download failed")
      }

      // In a real implementation, this would trigger the actual download
      // For now, we'll just simulate it
      window.open(file.url, "_blank")
    } catch (err) {
      console.error("Download error:", err)
      // Fallback to direct link
      window.open(file.url, "_blank")
    }
  }

  const getFileIcon = (type: DownloadFile["type"]) => {
    switch (type) {
      case "pdf":
      case "document":
        return <FileText className="h-5 w-5" />
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "audio":
        return <Music className="h-5 w-5" />
      case "archive":
        return <Archive className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getFileTypeColor = (type: DownloadFile["type"]) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "image":
        return "bg-green-100 text-green-800"
      case "video":
        return "bg-blue-100 text-blue-800"
      case "audio":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-blue-100 text-blue-800"
      case "archive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Downloads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Downloads</h2>
        <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground">
          {filteredFiles.length} Files
        </Badge>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedCategory(category.id === selectedCategory ? "all" : category.id)}
          >
            <CardContent className="p-4 text-center">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm text-balance">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.fileCount} files</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="archive">Archive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchFiles} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-primary">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-balance leading-tight">{file.name}</CardTitle>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-xs ${getFileTypeColor(file.type)}`}>
                  {file.type.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {file.description && <p className="text-sm text-muted-foreground mb-4 text-pretty">{file.description}</p>}

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(file.uploadDate).toLocaleDateString()}
                </div>
                <span>{file.size}</span>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleDownload(file)} className="flex-1" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {file.previewUrl && (
                  <Button variant="outline" size="sm" onClick={() => window.open(file.previewUrl, "_blank")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {file.downloadCount && (
                <p className="text-xs text-muted-foreground mt-2 text-center">Downloaded {file.downloadCount} times</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Mock data
const mockCategories: FileCategory[] = [
  { id: "handbook", name: "Handbooks", description: "School handbooks and policies", fileCount: 5 },
  { id: "forms", name: "Forms", description: "Permission slips and forms", fileCount: 8 },
  { id: "newsletters", name: "Newsletters", description: "Monthly newsletters", fileCount: 12 },
  { id: "photos", name: "Photos", description: "Event photos", fileCount: 25 },
  { id: "videos", name: "Videos", description: "School videos", fileCount: 6 },
  { id: "resources", name: "Resources", description: "Educational resources", fileCount: 15 },
]

const mockFiles: DownloadFile[] = [
  {
    id: "1",
    name: "Parent Handbook 2024-2025",
    description: "Complete guide for parents including policies, procedures, and important information",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2024-08-15",
    category: "handbook",
    url: "/placeholder.pdf",
    downloadCount: 156,
  },
  {
    id: "2",
    name: "Field Trip Permission Form",
    description: "Required form for all field trip participation",
    type: "pdf",
    size: "245 KB",
    uploadDate: "2024-09-01",
    category: "forms",
    url: "/placeholder.pdf",
    downloadCount: 89,
  },
  {
    id: "3",
    name: "October Newsletter",
    description: "Monthly newsletter with updates and upcoming events",
    type: "pdf",
    size: "1.8 MB",
    uploadDate: "2024-10-01",
    category: "newsletters",
    url: "/placeholder.pdf",
    downloadCount: 234,
  },
  {
    id: "4",
    name: "Spring Festival Photos",
    description: "Collection of photos from the 2024 Spring Festival celebration",
    type: "archive",
    size: "45.2 MB",
    uploadDate: "2024-03-20",
    category: "photos",
    url: "/placeholder.zip",
    downloadCount: 67,
  },
  {
    id: "5",
    name: "Grade 5 Play Recording",
    description: "Video recording of the Grade 5 class play performance",
    type: "video",
    size: "125 MB",
    uploadDate: "2024-05-15",
    category: "videos",
    url: "/placeholder.mp4",
    previewUrl: "/placeholder.mp4",
    downloadCount: 45,
  },
  {
    id: "6",
    name: "Waldorf Education Guide",
    description: "Introduction to Waldorf education philosophy and methods",
    type: "pdf",
    size: "3.1 MB",
    uploadDate: "2024-07-10",
    category: "resources",
    url: "/placeholder.pdf",
    downloadCount: 123,
  },
  {
    id: "7",
    name: "Emergency Contact Form",
    description: "Updated emergency contact information form",
    type: "document",
    size: "156 KB",
    uploadDate: "2024-08-25",
    category: "forms",
    url: "/placeholder.docx",
    downloadCount: 78,
  },
  {
    id: "8",
    name: "School Calendar 2024-2025",
    description: "Complete academic year calendar with all important dates",
    type: "pdf",
    size: "892 KB",
    uploadDate: "2024-08-01",
    category: "handbook",
    url: "/placeholder.pdf",
    downloadCount: 201,
  },
]
