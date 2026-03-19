# Deployment Guide for WMS Application

## Overview
This guide will help you deploy your Warehouse Management System (WMS) to Hostinger Node.js hosting at `wms.thourayaalbilad.com`.

## Prerequisites
- Hostinger Node.js hosting plan
- Domain configured: `wms.thourayaalbilad.com`
- MySQL database created in Hostinger
- SSH access to your hosting account

## Step 1: Build the Application

1. Install dependencies:
```bash
npm install
```

2. Build frontend and backend:
```bash
npm run build:all
```

3. Prepare deployment files:
```bash
node deploy.js
```

## Step 2: Configure Database

1. Create a MySQL database in Hostinger control panel
2. Note the database credentials:
   - Host: usually `localhost`
   - Port: `3306`
   - Database name
   - Username
   - Password

3. Update the `.env` file on the server with your database credentials

## Step 3: Upload Files

1. Connect to your Hostinger hosting via SSH or File Manager
2. Navigate to the Node.js application directory
3. Upload all files from the `./deploy` directory to your hosting

## Step 4: Configure Environment Variables

On your Hostinger hosting, set these environment variables:

```bash
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

## Step 5: Install Dependencies and Start

1. SSH into your Hostinger account
2. Navigate to your application directory
3. Install dependencies:
```bash
npm install --production
cd Backend && npm install --production
```

4. Start the application:
```bash
npm start
```

## Step 6: Configure Hostinger Node.js

1. In Hostinger control panel, go to Node.js section
2. Set the application root directory to your project folder
3. Set the startup file to `server.js`
4. Set the Node.js version (recommend 18.x or higher)
5. Configure the domain to point to your application

## Step 7: Database Migration

Run the database migration script:

```bash
cd Backend
npm run migration:run
```

Or manually execute the SQL from `migration.sql` file in your Hostinger database.

## Troubleshooting

### Common Issues:

1. **Port Issues**: Ensure your application runs on the port specified by Hostinger (usually 3000)
2. **Database Connection**: Verify database credentials and that MySQL is running
3. **Build Errors**: Make sure all dependencies are installed and the build process completes successfully
4. **Environment Variables**: Double-check all environment variables are set correctly

### Logs:

Check application logs in Hostinger control panel or via SSH:

```bash
tail -f logs/app.log
```

## Security Considerations

1. Change the default JWT secret in production
2. Use strong database passwords
3. Enable HTTPS (Hostinger usually provides free SSL)
4. Regularly update dependencies
5. Monitor application logs for suspicious activity

## Monitoring

Monitor your application:
- Check Hostinger control panel for server status
- Monitor database performance
- Set up uptime monitoring if possible

## Support

For Hostinger-specific issues:
- Contact Hostinger support
- Check Hostinger documentation
- Review Node.js hosting guidelines

For application-specific issues:
- Check the application logs
- Verify database connectivity
- Ensure all environment variables are correctly set
