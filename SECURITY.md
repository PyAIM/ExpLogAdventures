# Security Documentation

## Security Measures Implemented

This application has been hardened against common web security vulnerabilities to ensure safe public deployment.

### 1. Input Validation & Sanitization

**Player Name Input:**
- Maximum length: 50 characters
- Minimum length: 2 characters
- Must contain at least one alphanumeric character
- HTML tags and script content are stripped
- Validation occurs both client-side and in localStorage operations

**Implementation:**
- `client/src/lib/security.ts` - Core security utilities
- `client/src/contexts/PlayerContext.tsx` - Sanitization in context
- `client/src/components/PlayerNameModal.tsx` - Input validation

### 2. XSS (Cross-Site Scripting) Protection

**Protections:**
- React's built-in JSX escaping (no `dangerouslySetInnerHTML` used)
- Input sanitization removes HTML tags and script content
- Content Security Policy headers block inline scripts (except trusted sources)
- X-XSS-Protection header enabled

### 3. Content Security Policy (CSP)

**Policy Details:**
```
default-src 'self'
script-src 'self' 'unsafe-inline' https://files.manuscdn.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https://files.manuscdn.com https://cdn.manus.space
media-src 'self' https://files.manuscdn.com
connect-src 'self' https://files.manuscdn.com
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
```

**Note:** `'unsafe-inline'` is used for scripts and styles due to React's inline style requirements and Vite's development mode. For production, consider using nonces or hashes.

### 4. Security Headers

**Implemented Headers:**
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection: 1; mode=block` - Browser XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features (geolocation, microphone, camera)
- `Strict-Transport-Security` - Forces HTTPS (production only)

**Configuration Files:**
- `server/index.ts` - Express middleware for development/self-hosted
- `client/public/_headers` - Static headers for Netlify/Cloudflare Pages

### 5. LocalStorage Security

**Protections:**
- Data size limits (100KB per key) to prevent overflow attacks
- Input sanitization before storage
- Validation when loading from storage
- Automatic cleanup of corrupted data

### 6. No SQL Injection Risk

This is a static frontend application with no database, eliminating SQL injection vulnerabilities.

### 7. No Server-Side Code Execution

All user input is processed client-side with React, with no server-side evaluation of user data.

## Deployment Recommendations

### For Static Hosting (Netlify, Cloudflare Pages, GitHub Pages)

1. The `_headers` file in `client/public/` will automatically apply security headers
2. Ensure HTTPS is enabled (most platforms do this by default)
3. Consider adding a custom domain with SSL certificate

### For Self-Hosted Deployment

1. Use a reverse proxy (nginx/Apache) with HTTPS
2. The Express server in `server/index.ts` includes security headers
3. Set `NODE_ENV=production` to enable HSTS
4. Consider using helmet.js for additional security headers

### Additional Security Considerations

1. **Regular Updates:** Keep dependencies updated to patch security vulnerabilities
2. **HTTPS Only:** Always serve over HTTPS in production
3. **Monitoring:** Monitor for unusual activity or error patterns
4. **Rate Limiting:** Consider adding rate limiting for API endpoints if backend is added
5. **Audit:** Regularly audit dependencies with `npm audit` or `pnpm audit`

## Testing Security

### Manual Testing

1. **XSS Test:**
   - Try entering `<script>alert('xss')</script>` as player name
   - Expected: Script tags stripped, safe text stored

2. **Length Validation:**
   - Try entering a name longer than 50 characters
   - Expected: Error message displayed

3. **Special Characters:**
   - Try entering only special characters (e.g., `!!!@@@###`)
   - Expected: Error message about needing alphanumeric characters

4. **HTML Injection:**
   - Try entering `<img src=x onerror=alert('xss')>`
   - Expected: HTML tags stripped, safe text stored

### Automated Testing

Consider adding security testing tools:
- OWASP ZAP for vulnerability scanning
- npm audit for dependency vulnerabilities
- Snyk for continuous security monitoring

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do not publicly disclose the vulnerability
2. Contact the maintainer directly
3. Provide detailed information about the vulnerability
4. Allow reasonable time for a fix before public disclosure

## Security Checklist for Deployment

- [ ] All dependencies updated to latest secure versions
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Input validation tested
- [ ] CSP policy reviewed and tested
- [ ] No sensitive data in client-side code
- [ ] Error messages don't reveal system information
- [ ] Rate limiting considered (if applicable)
- [ ] Security audit completed

## Last Updated

February 17, 2026

## Version

v2.1 (Security Hardened)
