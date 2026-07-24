#!/bin/bash

# BYT Education Platform - Quick Start Script
# This script sets up and runs the entire platform

set -e

echo "🚀 BYT Education Platform - Quick Start"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Stop any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down 2>/dev/null || true
echo ""

# Build and start services
echo "🏗️  Building Docker images (this may take a few minutes)..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo ""
echo "📊 Service Status:"
echo "=================="

if docker ps | grep -q "byt-mongodb"; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
fi

if docker ps | grep -q "byt-backend"; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API failed to start"
fi

if docker ps | grep -q "byt-frontend"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
fi

echo ""
echo "🎉 Platform is ready!"
echo "===================="
echo ""
echo "📱 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "🔐 Default login credentials:"
echo "   Email:    admin@byt.education"
echo "   Password: admin123"
echo "   ⚠️  Change this password immediately!"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop the platform:"
echo "   docker-compose down"
echo ""
echo "📚 For more information, see README.md"
echo ""
