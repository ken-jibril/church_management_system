#!/bin/bash
# Run migrations script for Render deployment

echo "Running database migrations..."
python manage.py migrate --verbosity=2

echo "Migrations completed!"
