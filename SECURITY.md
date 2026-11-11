# Security

- Never commit secrets or paste passwords in chat.
- RLS on all portal tables; public read limited to published/public apps and settings.
- Admin routes require authenticated admin (`admin_users` or demo bootstrap allowlist).
- Register endpoint requires `PORTAL_REGISTER_SECRET`.
- App record delete does **not** delete hosting infrastructure.
- Ask before paid resources, destructive prod changes, or irreversible account ops.
