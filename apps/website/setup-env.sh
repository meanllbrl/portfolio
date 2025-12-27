#!/bin/bash
# Script to copy Firebase environment variables from portfolio_admin to portfolio

SOURCE_ENV="../portfolio_admin/.env.local"
TARGET_ENV=".env.local"

if [ -f "$SOURCE_ENV" ]; then
  echo "Copying environment variables from portfolio_admin to portfolio..."
  cp "$SOURCE_ENV" "$TARGET_ENV"
  echo "✅ Environment variables copied successfully!"
  echo ""
  echo "⚠️  IMPORTANT: Make sure all Firebase variables in .env.local start with NEXT_PUBLIC_"
  echo "   Example: NEXT_PUBLIC_FIREBASE_API_KEY=..."
  echo ""
  echo "📝 After copying, restart your Next.js dev server for changes to take effect."
else
  echo "❌ Source file not found: $SOURCE_ENV"
  echo ""
  echo "Please create .env.local manually in the portfolio/ directory with:"
  echo "  NEXT_PUBLIC_FIREBASE_API_KEY=your_key"
  echo "  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain"
  echo "  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id"
  echo "  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket"
  echo "  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
  echo "  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id"
fi







