# Waldorf School Parent Portal

A password-protected parent portal built with Next.js that provides access to school gallery, calendar, and downloads through a Laravel API backend.

## Features

- **Password Protection**: Simple authentication system for parent access
- **Photo Gallery**: Browse school event photos organized by albums (Google Photos API via Laravel)
- **School Calendar**: View upcoming events and important dates (Google Calendar API via Laravel)
- **Downloads**: Access school documents, forms, and resources (Google Drive API via Laravel)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Warm Waldorf Theme**: Educational-focused design with warm colors and friendly interface

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Laravel API Configuration
LARAVEL_API_URL=http://localhost:8000/api
LARAVEL_API_TOKEN=your_laravel_api_token_here

# Optional: For development redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## Laravel API Endpoints

Your Laravel API should implement the following endpoints:

### Gallery Endpoints
- `GET /api/gallery/albums` - Get all photo albums
- `GET /api/gallery/albums/{id}/photos` - Get photos for a specific album

### Calendar Endpoints
- `GET /api/calendar/events?year={year}&month={month}` - Get calendar events for a specific month

### Downloads Endpoints
- `GET /api/downloads/categories` - Get file categories
- `GET /api/downloads/files` - Get all downloadable files
- `POST /api/downloads/files/{id}/download` - Track download and get file URL

## Expected API Response Formats

### Gallery Albums Response
\`\`\`json
{
  "albums": [
    {
      "id": "1",
      "title": "Spring Festival 2024",
      "date": "March 15, 2024",
      "coverPhoto": "https://example.com/cover.jpg",
      "photoCount": 24
    }
  ]
}
\`\`\`

### Gallery Photos Response
\`\`\`json
{
  "photos": [
    {
      "id": "1-1",
      "url": "https://example.com/photo.jpg",
      "thumbnail": "https://example.com/thumb.jpg",
      "title": "Spring Dance Performance",
      "date": "March 15, 2024",
      "event": "Spring Festival",
      "description": "Children performing traditional spring dances"
    }
  ]
}
\`\`\`

### Calendar Events Response
\`\`\`json
{
  "events": [
    {
      "id": "1",
      "title": "Parent-Teacher Conferences",
      "description": "Individual meetings with teachers",
      "date": "2024-12-20",
      "startTime": "9:00 AM",
      "endTime": "5:00 PM",
      "location": "Main Building",
      "type": "meeting",
      "attendees": ["Parents", "Teachers"]
    }
  ]
}
\`\`\`

### Downloads Categories Response
\`\`\`json
{
  "categories": [
    {
      "id": "handbook",
      "name": "Handbooks",
      "description": "School handbooks and policies",
      "fileCount": 5
    }
  ]
}
\`\`\`

### Downloads Files Response
\`\`\`json
{
  "files": [
    {
      "id": "1",
      "name": "Parent Handbook 2024-2025",
      "description": "Complete guide for parents",
      "type": "pdf",
      "size": "2.4 MB",
      "uploadDate": "2024-08-15",
      "category": "handbook",
      "url": "https://example.com/handbook.pdf",
      "previewUrl": "https://example.com/preview.pdf",
      "downloadCount": 156
    }
  ]
}
\`\`\`

## Authentication

The portal uses a simple password-based authentication system. The default password is `waldorf2024`. In production, you should:

1. Implement proper user authentication with your Laravel backend
2. Use secure session management
3. Add proper password hashing and validation
4. Consider implementing role-based access control

## Google API Integration (Laravel Backend)

Your Laravel backend should handle the integration with Google APIs:

### Google Photos API
- Authenticate with Google Photos API
- Fetch albums and photos
- Handle image resizing and thumbnails
- Cache responses for better performance

### Google Calendar API
- Connect to school's Google Calendar
- Fetch events with proper filtering
- Handle recurring events
- Format dates and times appropriately

### Google Drive API
- Access shared school documents folder
- Organize files by categories
- Track download statistics
- Handle file permissions and access control

## Deployment

1. **Next.js App**: Deploy to Vercel or your preferred hosting platform
2. **Laravel API**: Deploy to your server with proper SSL certificates
3. **Environment Variables**: Set up production environment variables
4. **CORS**: Configure CORS settings in Laravel for your Next.js domain

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Security Considerations

- Implement proper authentication and authorization
- Use HTTPS for all API communications
- Validate and sanitize all user inputs
- Implement rate limiting on API endpoints
- Regular security audits and updates
- Secure file upload and download handling

## Support

For technical support or questions about the parent portal, please contact the school's IT administrator.
