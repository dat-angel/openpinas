import { NextRequest, NextResponse } from "next/server"

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY

interface ButtondownError {
  email?: string[]
  detail?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    if (!BUTTONDOWN_API_KEY) {
      // If no API key, log the email and return success for development
      console.log("[OpenPinas] Newsletter signup (no API key):", email)
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing! (Development mode)",
      })
    }

    // Call Buttondown API
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        tags: ["openpinas-website"],
      }),
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing! Check your email to confirm.",
      })
    }

    // Handle Buttondown errors
    const errorData: ButtondownError = await response.json()

    if (response.status === 400 && errorData.email) {
      // Email already subscribed or invalid
      const errorMessage = errorData.email[0]
      if (errorMessage?.includes("already")) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed! Check your inbox for our latest updates.",
        })
      }
      return NextResponse.json(
        { error: errorMessage || "Invalid email address" },
        { status: 400 }
      )
    }

    console.error("[OpenPinas] Buttondown API error:", errorData)
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  } catch (error) {
    console.error("[OpenPinas] Subscribe error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  }
}
