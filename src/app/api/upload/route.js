import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILES = 5

export async function POST(request) {
  try {
    const formData = await request.formData()
    // Get all files from form data
    const files = formData.getAll('images')
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      )
    }

    const uploadedUrls = []
    const uploadPromises = []

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
          { status: 400 }
        )
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 5MB` },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create upload promise
      const uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            resource_type: 'image',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error)
              reject(error)
            } else {
              resolve(result.secure_url)
            }
          }
        ).end(buffer)
      })

      uploadPromises.push(uploadPromise)
    }

    // Wait for all uploads to complete
    try {
      const urls = await Promise.all(uploadPromises)
      uploadedUrls.push(...urls)
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload one or more images to Cloudinary' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedUrls.length} image(s)`,
      urls: uploadedUrls
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload images',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
