"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { WhatsAppService } from "@/lib/whatsapp"

interface WhatsAppButtonProps {
  phone: string
  professionalName?: string
  service?: string
  message?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  children?: React.ReactNode
}

export function WhatsAppButton({
  phone,
  professionalName,
  service,
  message,
  variant = "default",
  size = "md",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    WhatsAppService.openWhatsApp({
      phone,
      professionalName,
      service,
      message,
    })
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {children || "WhatsApp"}
    </Button>
  )
}
